from flask import Blueprint, request, jsonify, session
from ..supabase_client import supabase

user_bp = Blueprint("user", __name__)

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")

    if not email or not password or not first_name or not last_name:
        return jsonify({"error": "Email and password are required", "valid" : False}), 400

    try:
        
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        user_id = auth_response.user.id 

        existing = supabase.table("users").select("*").eq("mail", email).execute()
        if existing.data:
            return jsonify({"error": "User already exists in database", "valid" : False}), 400

        supabase.table("users").insert({
            "mail": email,
            "first_name" : first_name,
            "last_name" : last_name
        }).execute()

        return jsonify({
            "message": "User registered",
            "data": {
                "id": user_id,
                "email": email
            },
            "valid" : True
        }), 201

    except Exception as e:
        return jsonify({"error": str(e), "valid" : False}), 400

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required", "valid" : False}), 400

    try:
        
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if auth_response.session is None:
            return jsonify({"error": "Invalid credentials", "valid" : False}), 401

        
        user_data = supabase.table("users").select("*").eq("mail", email).single().execute()

        session["refresh_token"] = auth_response.session.refresh_token
        session["access_token"] = auth_response.session.access_token
        session["expires_at"] = auth_response.session.expires_at

        return jsonify({
            "message": "Logged in successfully",
            "user": user_data.data,
            "valid" : True
        }), 200

    except Exception as e:
        return jsonify({"error": str(e), "valid" : False}), 400


@user_bp.route("/logout", methods=["POST"])
def logout():
    access_token = session.get("access_token")

    if not access_token:
        return jsonify({"error": "Refresh token is required", "valid" : False}), 400

    try:

        supabase.auth.admin.sign_out(access_token)


        session.pop("access_token", None)
        session.pop("refresh_token", None)
        session.pop("expires_at", None)


        return jsonify({"message": "Logged out successfully", "valid" : True}), 200
    except Exception as e:
        return jsonify({"error": str(e), "valid" : False}), 400