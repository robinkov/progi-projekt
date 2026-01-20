from flask import Flask, request, jsonify, Blueprint
from ..supabase_client import supabase
from app.auth.auth import verify_token
from datetime import datetime
from dateutil.relativedelta import relativedelta
from app.auth.membership import has_membership

membership_bp = Blueprint("membership_bp", __name__)


@membership_bp.route("/memberships", methods=["GET"])
def get_membership_plans():

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    valid, _ = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    membership_plans = supabase.table("membership_plans").select("*").execute()

    return jsonify({"success": True, "data": membership_plans.data}), 200


@membership_bp.route("/memberships/<int:plan_id>", methods=["GET"])
def get_membership_plan_by_id(plan_id):

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

    # Get organizer
    organizer_resp = (
        supabase.table("organizers")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not organizer_resp.data:
        return jsonify({"success": False, "error": "Organizer not found"}), 404
    organizer_id = organizer_resp.data["id"]

    try:
        membership_plan = (
            supabase.table("membership_plans")
            .select("*")
            .eq("id", plan_id)
            .single()
            .execute()
        )
    except:
        return jsonify({"success": False, "error": "Membership plan not found."}), 404

    needs_membership = not has_membership(organizer_id=organizer_id)
    return (
        jsonify(
            {
                "success": True,
                "data": membership_plan.data,
                "needs_membership": needs_membership,
            }
        ),
        200,
    )

@membership_bp.route("/memberships/active", methods=["GET"])
def get_active_memberships():    
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
    try:
        user_resp = (
            supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
        ).data
    except:
        return jsonify({"success": False, "error": "User not found"}), 404

    user_id = user_resp["id"]

    try:
        organizer_resp = (
            supabase.table("organizers").select("*").eq("user_id", user_id).single().execute()
        ).data
    except:
        return jsonify({"success": False, "error": "Organizer not found"}), 404
    
    organizer_id = organizer_resp["id"]

    try:
        membership_transaction_resp = (
            supabase.table("membership_transactions").select("*").eq("organizer_id", organizer_id).single().execute()
        ).data
    except:
        return jsonify({"success": True, "data": None}), 200
    
    plan_id = membership_transaction_resp["membership_plan_id"]
    membership_plan_resp = (
        supabase.table("membership_plans").select("*").eq("id", plan_id).single().execute()
    ).data

    duration_months = membership_plan_resp["duration_months"]

    transaction_id = membership_transaction_resp["transaction_id"]
    transaction_date = (
        supabase.table("transactions").select("date_time").eq("id", transaction_id).single().execute()
    ).data["date_time"]

    transaction_date = datetime.fromisoformat(transaction_date)
    transaction_expiry = transaction_date + relativedelta(months=duration_months)

    if (datetime.now().date() > transaction_expiry.date()):
        return jsonify({"success": True, "data": None}), 200

    return jsonify({"success": True, "data": {**membership_plan_resp, "transaction_date": transaction_date}}), 200

@membership_bp.route("/memberships/update", methods=["POST"])
def change_price_of_membership():
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

    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "Missing request body"}), 400

    try:
        user_resp = (
            supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
        ).data
    except:
        return jsonify({"success": False, "error": "User not found"}), 404

    user_id = user_resp["id"]
    
    try:
        admin_resp = (
            supabase.table("admins").select("*").eq("user_id", user_id).single().execute()
        ).data
    except:
        return jsonify({"success": False, "error": "Admin not found"}), 404

    if (admin_resp["can_change_prices"] == False):
        return jsonify({"success": False, "error": "Missing permission to change prices"}), 401
    
    try:
        plan_id = int(data.get("planId"))
        price = int(data.get("price"))
    except:
        return jsonify({"success": False, "error": "Invalid parameters"}), 401
    
    # Update membership plan
    response = (
        supabase
        .table("membership_plans")
        .update({"price": float(price)})
        .eq("id", plan_id)
        .execute()
    )

    if not response.data:
        return jsonify({
            "success": False,
            "error": "Membership plan not found"
        }), 404
    
    return jsonify({"success": True, "data": None}), 200
