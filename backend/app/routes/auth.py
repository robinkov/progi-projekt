from flask import Blueprint, request, jsonify
import os
import requests

user_bp = Blueprint("user", __name__)

SUPA_VERIFY_URL = os.environ.get("SUPABASE_VERIFY_URL")

def verify_token(token):
    headers = {"Authorization": f"Bearer {token}"}
    res = requests.get(SUPA_VERIFY_URL, headers=headers)
    if res.status_code == 200:
        return True, res.json() 
    return False, None          

@user_bp.route("/profile")
def profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    valid, user_data = verify_token(token)
    if not valid:
        return jsonify({"error": "Unauthorized"}), 401

    return jsonify({"message": "Hello!", "user": user_data})


