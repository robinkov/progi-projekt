from flask import Blueprint, request, jsonify
from ..supabase_client import supabase
from .auth import verify_token

user_bp = Blueprint("user_routes", __name__)


@user_bp.route("/getuser", methods=["GET"])
def get_user():
    # --- Provjera tokena ---
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token", "validToken": False}), 401

    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    valid, token_data = verify_token(token)
    if not valid:
        return jsonify({"validToken": False, "error": token_data.get("error")}), 401

    auth_id = token_data["sub"]

    try:
        # --- Dohvati korisnika ---
        user_resp = supabase.table("users").select("*").eq("auth_id", auth_id).execute()
        if not getattr(user_resp, "data", None) or len(user_resp.data) == 0:
            return jsonify({"error": "User not found"}), 404

        user = user_resp.data[0]
        user_pk = user["id"]  # ovo je user_id u drugim tablicama

        # --- Dohvati URL slike ako postoji ---
        photo_url = None
        if user.get("profile_photo_id"):
            photo_resp = supabase.table("photos").select("url").eq("id", user["profile_photo_id"]).execute()
            if getattr(photo_resp, "data", None) and len(photo_resp.data) > 0:
                photo_url = photo_resp.data[0].get("url")

        # --- Provjeri ulogu korisnika ---
        role = None
        org_resp = supabase.table("organizers").select("id").eq("user_id", user_pk).execute()
        if getattr(org_resp, "data", None) and len(org_resp.data) > 0:
            role = "organizer"
        else:
            part_resp = supabase.table("participants").select("id").eq("user_id", user_pk).execute()
            if getattr(part_resp, "data", None) and len(part_resp.data) > 0:
                role = "participant"

        # --- Sastavi odgovor ---
        user_data = {
            "first_name": user.get("first_name"),
            "last_name": user.get("last_name"),
            "username": user.get("username"),
            "address": user.get("address"),
            "mail": user.get("mail"),
            "phone": user.get("phone"),
            "profile_photo_url": photo_url,
            "role": role
        }

        return jsonify({"validToken": True, "user": user_data}), 200

    except Exception as e:
        return jsonify({"error": "Failed to fetch user data", "details": str(e)}), 500
