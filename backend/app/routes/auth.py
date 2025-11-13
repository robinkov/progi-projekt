import jwt
from flask import Blueprint, request, jsonify
import os
from ..supabase_client import supabase, admin_supabase

user_bp = Blueprint("user_metadata", __name__)

JWT_SECRET = os.environ.get("SUPABASE_JWT_SECRET")
JWT_ALGORITHM = "HS256"

def verify_token(token):
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM], options={"verify_aud": False})
        return True, payload
    except jwt.ExpiredSignatureError:
        return False, {"error": "Token expired"}
    except jwt.InvalidTokenError:
        return False, {"error": "Invalid token"}

@user_bp.route("/profile", methods=["GET"])
def profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token", "validToken": False}), 401

    valid, token_data = verify_token(auth_header)
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
        "validToken": True
    }), 200
