import jwt
from flask import Blueprint, request, jsonify
import os
from ..supabase_client import supabase, admin_supabase
from app.auth.auth import verify_token

auth_bp = Blueprint("user_metadata", __name__)

    

#function that checks token and puts user in user table
@auth_bp.route("/user", methods=["POST"])
def profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token", "validToken": False}), 401
    
    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header

    valid, token_data = verify_token(token)
    if not valid:
        return jsonify({"validToken": False}), 401

    auth_id = token_data["sub"]

    
    user_resp = admin_supabase.auth.admin.get_user_by_id(auth_id)
    user = user_resp.user
    user_metadata = user.user_metadata or {}

    full_name = user_metadata.get("full_name")
    first_name = full_name.split()[0]
    last_name = full_name.split()[1]
    mail = user.email
    
    existing_user = supabase.table("users").select("id").eq("auth_id", auth_id).execute()
    existing_user_data = existing_user.data
    
    if not existing_user_data:
        supabase.table("users").upsert({
            "auth_id": auth_id,
            "mail": mail,
            "first_name": first_name,
            "last_name": last_name
        }, on_conflict="auth_id").execute()

        


    return jsonify({
        "validToken": True,
        "user_existed": True if existing_user_data else False
    }), 200


@auth_bp.route("/setrole", methods=["POST"])
def set_role():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header

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
        supabase.table("organizers").insert({
            "user_id": user_id,
            "approved_by_admin": False
        }).execute()
    elif role == "polaznik":
        supabase.table("participants").insert({
            "user_id": user_id
        }).execute()

    return jsonify({"success": True}), 200

    
