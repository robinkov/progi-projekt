
from flask import Blueprint, request, jsonify
from ..supabase_client import supabase, admin_supabase
from app.auth.auth import verify_token

profile_bp = Blueprint("profile_management", __name__)


@profile_bp.route("/profile", methods=["POST"])
def get_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    valid, token_data = verify_token(token)

    if not valid:
        return jsonify({"error": "Invalid token"}), 401

    auth_id = token_data["sub"]

    user_resp = (
        supabase
        .table("users")
        .select("first_name,last_name,mail,username,address,phone,profile_photo_id")
        .eq("auth_id", auth_id)
        .single()
        .execute()
    )

    if not user_resp.data:
        return jsonify({"error": "User not found"}), 404

    user = user_resp.data
    photo_url = None
    
    if user.get("profile_photo_id"):
    
        photo_resp = supabase.table("photos").select("url").eq("id", user.get("profile_photo_id")).single().execute()
    
        photo_url = photo_resp.data.get("url") if photo_resp.data else None

    return jsonify({
        "first_name": user.get("first_name"),
        "last_name": user.get("last_name"),
        "email": user.get("mail"),
        "username": user.get("username"),
        "phone": user.get("phone"),
        "address":user.get("address"),
        "avatar_url": photo_url,
    }), 200
    
    

@profile_bp.route("/profile/update", methods=["POST"])
def update_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]

    try:
        # Get user info from Supabase Auth
        user_resp = admin_supabase.auth.get_user(token)
        user_id = user_resp.user.id

        data = request.json
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        username = data.get("username")
        phone = data.get("phone")
        address = data.get("address")
        avatar_url = data.get("avatar_url")

        # Update users table (without touching profile_photo_id yet)
        supabase.table("users").update({
            "first_name": first_name,
            "last_name": last_name,
            "username": username,
            "phone": phone,
            "address": address,
        }).eq("auth_id", user_id).execute()

        if avatar_url:
            # Insert a new row in photos table for the new avatar
            photo_resp = supabase.table("photos").insert({"url": avatar_url}).execute()
            new_photo_id = photo_resp.data[0]["id"] if photo_resp.data else None

            # Update the user to point to the new photo
            if new_photo_id:
                supabase.table("users").update({"profile_photo_id": new_photo_id}).eq("auth_id", user_id).execute()

        return jsonify({"message": "Profile updated successfully"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
