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
PAYPAL_API = "https://api-m.paypal.com"  # Use 'api-m.paypal.com' for production


# Helper: Get PayPal Access Token
def get_paypal_token():
    res = requests.post(
        f"{PAYPAL_API}/v1/oauth2/token",
        auth=(PAYPAL_CLIENT_ID, PAYPAL_SECRET),
        data={"grant_type": "client_credentials"},
    )
    print(res.json())
    return res.json()["access_token"]


# --- ENDPOINT 1: Create Order ---
@paypal_bp.route("/api/paypal/create-order", methods=["POST"])
def create_order():
    data = request.json
    workshop_id = data.get("workshopId")

    # 1. Fetch real price from Supabase (Source of Truth)
    workshop = (
        supabase.table("workshops")
        .select("price, title")
        .eq("id", workshop_id)
        .single()
        .execute()
    )

    if not workshop.data:
        return jsonify({"error": "Workshop not found"}), 404

    price = workshop.data["price"]
    title = workshop.data["title"]

    # 2. Tell PayPal to create the order
    token = get_paypal_token()
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}
    payload = {
        "intent": "CAPTURE",
        "purchase_units": [
            {
                "amount": {"currency_code": "EUR", "value": str(price)},
                "description": f"Registration for: {title}",
            }
        ],
    }

    res = requests.post(
        f"{PAYPAL_API}/v2/checkout/orders", json=payload, headers=headers
    )
    print(res.json())
    return jsonify(res.json())


# --- ENDPOINT 2: Capture Order & Save to Supabase ---
@paypal_bp.route("/api/paypal/capture-order", methods=["POST"])
def capture_order():
    data = request.json
    order_id = data.get("orderID")
    workshop_id = data.get("workshopId")
    user_id = data.get("userId")  # Passed from frontend auth state

    # 1. Tell PayPal to finalize (capture) the payment
    token = get_paypal_token()
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {token}"}

    res = requests.post(
        f"{PAYPAL_API}/v2/checkout/orders/{order_id}/capture", headers=headers
    )
    capture_data = res.json()

    # 2. Check if payment was actually successful
    if capture_data.get("status") == "COMPLETED":
        # 3. Save registration to Supabase
        registration_entry = {
            "user_id": user_id,
            "workshop_id": workshop_id,
            "paypal_order_id": order_id,
            "paid_amount": capture_data["purchase_units"][0]["payments"]["captures"][0][
                "amount"
            ]["value"],
            "status": "approved",
        }

        db_res = (
            supabase.table("workshop_registrations")
            .insert(registration_entry)
            .execute()
        )

        # 4. Optional: Decrement places_left in workshops table
        supabase.rpc("decrement_workshop_places", {"row_id": workshop_id}).execute()

        return jsonify({"success": True})

    return jsonify({"success": False, "error": "Payment not completed"}), 400
