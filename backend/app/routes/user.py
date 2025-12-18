from flask import Blueprint, request, jsonify
from ..supabase_client import supabase
from app.auth.auth import verify_token

user_bp = Blueprint("user_routes", __name__)


@user_bp.route("/getrole", methods=["GET", "POST"])
def get_user_role():
    # --- Check token ---
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"validToken": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    valid, token_data = verify_token(token)

    if not valid:
        return jsonify({"validToken": False}), 401

    auth_id = token_data["sub"]

    try:
        # --- Get user id ---
        user_resp = (
            supabase
            .table("users")
            .select("id")
            .eq("auth_id", auth_id)
            .single()
            .execute()
        )

        if not user_resp.data:
            return jsonify({"role": "none"}), 200

        user_id = user_resp.data["id"]

        # --- Check organizer role ---
        org_resp = (
            supabase
            .table("organizers")
            .select("id")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        if org_resp.data:
            return jsonify({"role": "organizator"}), 200

        # --- Check participant role ---
        part_resp = (
            supabase
            .table("participants")
            .select("id")
            .eq("user_id", user_id)
            .limit(1)
            .execute()
        )

        if part_resp.data:
            return jsonify({"role": "polaznik"}), 200

        # --- No role ---
        return jsonify({"role": "none"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
