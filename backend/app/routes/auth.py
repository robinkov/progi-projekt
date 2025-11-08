from flask import Blueprint, request, jsonify, session, redirect
from ..supabase_client import supabase, supabase_service, SUPABASE_ANON_KEY, SUPABASE_URL, SUPABASE_SERVICE_KEY
from dotenv import load_dotenv
import os
import requests

load_dotenv()
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
    
REDIRECT_URL = os.environ.get("SUPABASE_REDIRECT_URL") 

@user_bp.route("/login/google")
def google_login():
    try:
        # Generiši URL koji vodi korisnika na Google OAuth stranicu
        url = supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": REDIRECT_URL
            }
        })
        return redirect(url.url)  # preusmjeri korisnika na Google
    except Exception as e:
        return jsonify({"error": str(e), "valid": False}), 400



SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")
REDIRECT_URL = os.environ.get("SUPABASE_REDIRECT_URL")

@user_bp.route("/auth/callback")
def google_callback():
    code = request.args.get("code")
    if not code:
        return jsonify({"error": "Missing authorization code", "valid": False}), 400

    try:
        # Exchange the code for a session
        params = {
            "auth_code": code,
            "redirect_to": REDIRECT_URL
        }

        session_response = supabase.auth.exchange_code_for_session(params)
        if not session_response.session:
            return jsonify({"error": "Failed to exchange code", "valid": False}), 400

        session["access_token"] = session_response.session.access_token
        session["refresh_token"] = session_response.session.refresh_token
        session["expires_at"] = session_response.session.expires_at

        user = session_response.user

        # Convert the User object to a dictionary
        user_dict = {
            "id": user.id,
            "email": user.email,
            "aud": user.aud,
            "role": user.role,
            "confirmed_at": user.confirmed_at,
            "created_at": user.created_at,
            "last_sign_in_at": user.last_sign_in_at,
            "app_metadata": user.app_metadata,
            "user_metadata": user.user_metadata,
        }

        # Check if user already exists in your 'users' table
        existing = supabase.table("users").select("*").eq("mail", user.email).execute()
        if not existing.data:
            # Insert the new user
            supabase.table("users").insert({
                "mail": user.email,
                "first_name": user.user_metadata.get("full_name", "").split(" ")[0] if user.user_metadata else "",
                "last_name": " ".join(user.user_metadata.get("full_name", "").split(" ")[1:]) if user.user_metadata else ""
            }).execute()

        return jsonify({
            "message": "Google login successful",
            "user": user_dict,
            "valid": True
        })

    except Exception as e:
        return jsonify({"error": str(e), "valid": False})
