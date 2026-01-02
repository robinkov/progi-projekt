import jwt
from flask import Blueprint, request, jsonify
import os
from ..supabase_client import supabase, admin_supabase
from supabase import create_client
from app.auth.auth import verify_token
import requests

auth_bp = Blueprint("user_metadata", __name__)


# function that checks token and puts user in user table
@auth_bp.route("/user", methods=["POST"])
def profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token", "validToken": False}), 401

    token = (
        auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    )

    valid, token_data = verify_token(token)
    if not valid:
        return jsonify({"validToken": False}), 401

    auth_id = token_data["sub"]

    user_resp = admin_supabase.auth.admin.get_user_by_id(auth_id)
    user = user_resp.user
    user_metadata = user.user_metadata or {}

    full_name = user_metadata.get("full_name") or ""
    name_parts = full_name.split()

    first_name = name_parts[0] if len(name_parts) > 0 else ""
    last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

    mail = user.email

    existing_user = (
        supabase.table("users").select("id").eq("auth_id", auth_id).execute()
    )
    existing_user_data = existing_user.data

    # get avatar URL from metadata
    avatar_url = user_metadata.get("avatar_url") or user_metadata.get("picture") or None
    photo_id = None

    if not existing_user_data:
        if avatar_url:
            response = requests.get(avatar_url)
            if response.status_code == 200:
                file_bytes = response.content
                file_name = f"{auth_id}_avatar.png"
                bucket_name = "photos"

                # Upload to Supabase storage with admin client and upsert
                admin_supabase.storage.from_(bucket_name).upload(
                    file_name,
                    file_bytes,
                    {
                        "upsert": "true",
                        "contentType": "image/png",
                    },  # contentType is optional but recommended
                )

                # Get public URL
                public_url = admin_supabase.storage.from_(bucket_name).get_public_url(
                    file_name
                )

                # Save in photos table with user_id
                photo_resp = (
                    supabase.table("photos").insert({"url": public_url}).execute()
                )

                photo_id = photo_resp.data[0]["id"] if photo_resp.data else None

        user_response = (
            supabase.table("users")
            .upsert(
                {
                    "auth_id": auth_id,
                    "mail": mail,
                    "first_name": first_name,
                    "last_name": last_name,
                    "profile_photo_id": photo_id,
                },
                on_conflict="auth_id",
            )
            .execute()
        )

        user_id = user_response.data[0]["id"]

    else:
        user_id = existing_user_data[0]["id"]

    organizer_data = (
        supabase.table("organizers").select("*").eq("user_id", user_id).execute()
    )

    if organizer_data.data and len(organizer_data.data) > 0:
        role = "organizer"
    else:

        participant_data = (
            supabase.table("participants").select("*").eq("user_id", user_id).execute()
        )

        if participant_data.data and len(participant_data.data) > 0:
            role = "participant"
        else:
            admin_data = (
                supabase.table("admins").select("*").eq("user_id", user_id).execute()
            )
            if admin_data.data and len(admin_data.data) > 0:
                role = "admin"
            else:
                role = "none"

    return jsonify({"validToken": True, "user_role": role}), 200


@auth_bp.route("/setrole", methods=["POST"])
def set_role():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token"}), 401

    token = (
        auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    )

    valid, token_data = verify_token(token)
    if not valid:
        return jsonify({"error": "Invalid token"}), 401

    auth_id = token_data["sub"]

    # get role from request body
    data = request.get_json()
    role = data.get("role")
    if role not in ["organizator", "polaznik"]:
        return jsonify({"error": "Invalid role"}), 400

    # get user record
    user_resp = supabase.table("users").select("*").eq("auth_id", auth_id).execute()
    if len(user_resp.data) == 0:
        return jsonify({"error": "User not found"}), 404

    user_id = user_resp.data[0]["id"]

    # optionally create entry in role-specific table
    if role == "organizator":
        supabase.table("organizers").insert(
            {"user_id": user_id, "approved_by_admin": False}
        ).execute()
    elif role == "polaznik":
        supabase.table("participants").insert({"user_id": user_id}).execute()

    return jsonify({"success": True}), 200
