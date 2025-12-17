import jwt
from flask import Blueprint, request, jsonify
import os
from ..supabase_client import supabase, admin_supabase
from app.auth.auth import verify_token

auth_bp = Blueprint("user_metadata", __name__)

    

#function that checks token and puts user in user table
@auth_bp.route("/user", methods=["GET"])
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

    first_name = user_metadata.get("first_name")
    last_name = user_metadata.get("last_name")
    mail = user.email
    role = user_metadata.get("role")
    
    existing_user = supabase.table("users").select("id").eq("auth_id", auth_id).execute()
    
    if len(existing_user.data) == 0:
        inserted_user = supabase.table("users").insert({
            "auth_id": auth_id,
            "mail": mail,
            "first_name": first_name,
            "last_name": last_name,
        }).execute()
        user_id = inserted_user.data[0]["id"]

        
        if role == "organizer":
            supabase.table("organizers").insert({"user_id": user_id, 
                                                 "approved_by_admin": False}).execute()
        elif role == "participant":
            supabase.table("participants").insert({"user_id": user_id}).execute()

    return jsonify({
        "validToken": True,
        "user_existed": True if len(existing_user) > 0 else False
    }), 200

