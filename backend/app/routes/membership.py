from flask import Flask, request, jsonify, Blueprint
from ..supabase_client import supabase
from app.auth.auth import verify_token
from datetime import datetime, timedelta, timezone
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
        return jsonify({"success": False, "error": "Organizer not found"}), 403
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
def has_active_memberships():
    return jsonify({"success": True, "data": True}), 200
