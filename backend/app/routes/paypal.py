from flask import Blueprint, jsonify, request
from ..supabase_client import supabase, admin_supabase
from app.auth.auth import verify_token
from datetime import datetime, timedelta, timezone

import os
import requests
from flask import Flask, request, jsonify
from supabase import create_client, Client

paypal_bp = Blueprint("paypal_bp", __name__)

PAYPAL_CLIENT_ID = os.environ.get("PAYPAL_CLIENT_ID")
PAYPAL_SECRET = os.environ.get("PAYPAL_SECRET")
PAYPAL_API = "https://api-m.sandbox.paypal.com"  # Use 'api-m.paypal.com' for production


# Helper: Get PayPal Access Token
def get_paypal_token():
    res = requests.post(
        f"{PAYPAL_API}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        data={"grant_type": "client_credentials"},
    )
    return res.json()["access_token"]


def _get_workshop_order_item(workshop_id: int):
    """Load workshop price and description for PayPal order.

    Returns (price, description, error_response_or_None).
    """
    workshop_resp = (
        supabase.table("workshops")
        .select("price, title")
        .eq("id", workshop_id)
        .maybe_single()
        .execute()
    )

    if not workshop_resp or not workshop_resp.data:
        return None, None, (jsonify({"error": "Workshop not found"}), 404)

    price = workshop_resp.data["price"]
    title = workshop_resp.data["title"]
    description = f"Registration for: {title}"
    return price, description, None


def _get_product_order_item(product_id: int):
    """Load product price and description for PayPal order.

    Returns (price, description, error_response_or_None).
    """
    product_resp = (
        supabase.table("products")
        .select("price, name,quantity_left")
        .eq("id", product_id)
        .maybe_single()
        .execute()
    )

    if (
        not product_resp
        or not product_resp.data
        or product_resp.data["quantity_left"] <= 0
    ):
        return None, None, (jsonify({"error": "Product not found"}), 404)

    price = product_resp.data["price"]
    name = product_resp.data["name"]
    description = f"Purchase of product: {name}"
    return price, description, None


# --- ENDPOINT 1: Create Order ---
@paypal_bp.route("/api/paypal/create-order", methods=["POST"])
def create_order():
    """Create a PayPal order for either a workshop or a product.

    If request body contains "workshopId", a workshop registration is created.
    If it contains "productId", a product purchase is created.
    """
    data = request.json or {}
    workshop_id = data.get("workshopId")
    product_id = data.get("productId")

    if workshop_id:
        price, description, error = _get_workshop_order_item(workshop_id)
        if error is not None:
            return error
    elif product_id:
        price, description, error = _get_product_order_item(product_id)
        if error is not None:
            return error
    else:
        return jsonify({"error": "Missing workshopId or productId"}), 400

    # Tell PayPal to create the order
    token = get_paypal_token()
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {"currency_code": "EUR", "value": str(price)},
                "description": description,
            }
        ],
    }

    res = requests.post(
        f"{PAYPAL_API}/v2/checkout/orders", json=payload, headers=headers
    )
    return jsonify(res.json())


@paypal_bp.route("/api/paypal/create-order/membership", methods=["POST"])
def create_membership_order():
    data = request.json
    plan_id = data.get("membershipPlanId")

    try:
        membership_plan = (
            supabase.table("membership_plans")
            .select("*")
            .eq("id", plan_id)
            .single()
            .execute()
        )
    except:
        return (
            jsonify(
                {
                    "success": False,
                    "error": f"Membership plan with id {plan_id} does not exist.",
                }
            ),
            404,
        )

    membership_plan = membership_plan.data
    price = membership_plan["price"]
    name = membership_plan["name"]

    token = get_paypal_token()
    order = requests.post(
        f"{PAYPAL_API}/v2/checkout/orders",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        json={
            "intent": "CAPTURE",
            "purchase_units": [
                {
                    "amount": {"currency_code": "EUR", "value": str(price)},
                    "description": f"Membership purchase: {name}",
                }
            ],
        },
    )

    print(order.json())

    return jsonify(order.json()), 200


# --- ENDPOINT 2: Capture Order & Save to Supabase ---
@paypal_bp.route("/api/paypal/capture-order", methods=["POST"])
def capture_order():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404
    user_id = user_resp.data["id"]
    data = request.json or {}
    order_id = data.get("orderID")
    workshop_id = data.get("workshopId")
    product_id = data.get("productId")
    participant_resp = (
        supabase.table("participants")
        .select("id")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    participant_id = participant_resp.data["id"]
    token = get_paypal_token()
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    res = requests.post(
        f"{PAYPAL_API}/v2/checkout/orders/{order_id}/capture", headers=headers
    )
    capture_data = res.json()
    payment_source = capture_data.get("payment_source", {})
    method = "card" if "card" in payment_source else "paypal"

    # 2. Check if payment was actually successful
    if capture_data.get("status") == "COMPLETED":
        # 3. Save payment to transactions
        amount_value = capture_data["purchase_units"][0]["payments"]["captures"][0][
            "amount"
        ]["value"]

        transactions_res = (
            supabase.table("transactions")
            .insert(
                {
                    "paypal_order_id": order_id,
                    "amount": amount_value,
                    "method": method,
                    "date_time": str(datetime.now()),
                }
            )
            .execute()
        )

        transaction_id = transactions_res.data[0]["id"]

        if workshop_id:
            # Existing behaviour: save workshop reservation
            supabase.table("workshop_reservations").insert(
                {
                    "workshop_id": workshop_id,
                    "participant_id": participant_id,
                    "transaction_id": transaction_id,
                }
            ).execute()
        elif product_id:
            # New behaviour: save product order
            order_res = (
                supabase.table("orders")
                .insert(
                    {
                        "participant_id": participant_id,
                        "order_time": str(datetime.now()),
                        "transaction_id": transaction_id,
                    }
                )
                .execute()
            )

            order_id_db = order_res.data[0]["id"]

            # Link product to order
            supabase.table("products_orders").insert(
                {
                    "product_id": product_id,
                    "order_id": order_id_db,
                    "quantity": 1,
                }
            ).execute()

            resp = (
                supabase.table("products")
                .select("quantity_left")
                .eq("id", product_id)
                .single()
                .execute()
            )

            quantity_left = resp.data["quantity_left"]
            supabase.table("products").update(
                {"sold_at_least_once": True, "quantity_left": quantity_left - 1}
            ).eq("id", product_id).execute()

        return jsonify({"success": True})

    return jsonify({"success": False, "error": "Payment not completed"}), 400


@paypal_bp.route("/api/paypal/capture-order/membership", methods=["POST"])
def capture_membership_order():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404
    user_id = user_resp.data["id"]
    data = request.json
    order_id = data.get("orderId")
    plan_id = data.get("membershipPlanId")

    try:
        organizer_resp = (
            supabase.table("organizers")
            .select("*")
            .eq("user_id", user_id)
            .single()
            .execute()
        )
    except:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Only organizers can purchase paid memberships.",
                }
            ),
            403,
        )

    organizer_resp = organizer_resp.data
    organizer_id = organizer_resp["id"]

    token = get_paypal_token()

    capture = requests.post(
        f"{PAYPAL_API}/v2/checkout/orders/{order_id}/capture",
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
    )

    capture_data = capture.json()
    payment_source = capture_data.get("payment_source", {})
    method = "card" if "card" in payment_source else "paypal"

    if capture_data.get("status") == "COMPLETED":
        transaction_res = (
            supabase.table("transactions")
            .insert(
                {
                    "paypal_order_id": order_id,
                    "amount": capture_data["purchase_units"][0]["payments"]["captures"][
                        0
                    ]["amount"]["value"],
                    "method": method,
                    "date_time": str(datetime.now()),
                }
            )
            .execute()
        )

        supabase.table("membership_transactions").insert(
            {
                "organizer_id": organizer_id,
                "transaction_id": transaction_res.data[0]["id"],
                "membership_plan_id": plan_id,
            }
        ).execute()

        return jsonify({"success": True}), 200

    return jsonify({"success": False, "error": "Unknown payment error"}), 500


@paypal_bp.route("/organizer/transactions/products", methods=["GET"])
def get_product_transactions():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404
    user_id = user_resp.data["id"]

    seller_id = (
        supabase.table("organizers")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
        .data["id"]
    )

    products = (
        supabase.table("products").select("*").eq("seller_id", seller_id).execute().data
    )
    name_map = {o["id"]: o["name"] for o in products or []}

    product_ids = list({w["id"] for w in products if w.get("id")})

    product_orders = (
        supabase.table("products_orders")
        .select("order_id")
        .in_("product_id", product_ids)
        .execute()
        .data
    )
    product_map = {o["order_id"]: o["product_id"] for o in product_orders or []}

    order_ids = list({w["order_id"] for w in product_orders if w.get("order_id")})

    orders = supabase.table("orders").select("*").in_("id", order_ids).execute().data

    order_map = {o["transaction_id"]: o["id"] for o in product_orders or []}

    transaction_ids = list(
        {w["transaction_id"] for w in orders if w.get("transaction_id")}
    )
    participant_ids = list(
        {w["participant_id"] for w in orders if w.get("participant_id")}
    )
    participant_map = {o["id"]: o["participant_id"] for o in orders or []}

    transactions = (
        supabase.table("transactions")
        .select("*")
        .in_("id", transaction_ids)
        .execute()
        .data
    )

    participants = (
        supabase.table("participants")
        .select("*")
        .in_("id", participant_ids)
        .execute()
        .data
    )
    user_map = {o["id"]: o["user_id"] for o in participants or []}
    user_ids = list({w["user_id"] for w in participants if w.get("user_id")})

    users = supabase.table("users").select("*").in_("id", user_ids).execute().data

    mail_map = {o["id"]: o["mail"] for o in users or []}

    for t in transactions:
        order_id = order_map.get(t["id"])

        product_id = product_map.get(order_id)
        t["product_name"] = name_map.get(product_id)

        participant_id = participant_map.get(order_id)
        user_id = user_map.get(participant_id)
        t["participant_mail"] = mail_map.get(user_id)

    return jsonify({"success": True, "transactions": transactions}), 200


@paypal_bp.route("/organizer/transactions/workshops", methods=["GET"])
def get_product_workshops():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404
    user_id = user_resp.data["id"]

    organizer_id = (
        supabase.table("organizers")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
        .data["id"]
    )

    workshops = (
        supabase.table("workshops")
        .select("*")
        .eq("organizer_id", organizer_id)
        .execute()
        .data
    )

    title_map = {o["id"]: o["title"] for o in workshops or []}
    workshop_ids = list({w["id"] for w in workshops if w.get("id")})

    reservations = (
        supabase.table("workshop_reservations")
        .select("*")
        .in_("workshop_id", workshop_ids)
        .execute()
        .data
    )

    transaction_ids = list(
        {w["transaction_id"] for w in reservations if w.get("transaction_id")}
    )

    transactions = (
        supabase.table("transactions")
        .select("*")
        .in_("id", transaction_ids)
        .execute()
        .data
    )

    workshop_map = {o["transaction_id"]: o["workshop_id"] for o in reservations or []}

    participant_ids = list(
        {w["participant_id"] for w in reservations if w.get("participant_id")}
    )
    participant_map = {
        o["transaction_id"]: o["participant_id"] for o in reservations or []
    }

    participants = (
        supabase.table("participants")
        .select("*")
        .in_("id", participant_ids)
        .execute()
        .data
    )

    user_map = {o["id"]: o["user_id"] for o in participants or []}
    user_ids = list({w["user_id"] for w in participants if w.get("user_id")})

    users = supabase.table("users").select("*").in_("id", user_ids).execute().data

    mail_map = {o["id"]: o["mail"] for o in users or []}

    for t in transactions:
        participant_id = participant_map.get(t["id"])
        user_id = user_map.get(participant_id)
        t["participant_mail"] = mail_map.get(user_id)

        workshop_id = workshop_map.get(t["id"])
        t["workshop_title"] = title_map.get(workshop_id)

    return jsonify({"success": True, "transactions": transactions}), 200
