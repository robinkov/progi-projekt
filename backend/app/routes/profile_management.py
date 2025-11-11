from flask import Blueprint, request, jsonify
from ..supabase_client import supabase
from dotenv import load_dotenv
import jwt, os

load_dotenv()

profile_management_bp = Blueprint("profile_management_bp", __name__)

def get_current_user():
    
    token = request.headers.get("Authorization")
    if not token:
        return None

    try:
        payload = jwt.decode(
            token,
            os.getenv("SUPABASE_JWT_SECRET"),
            algorithms=["HS256"],
            audience="authenticated"
        )
        return payload.get("sub") 
    except jwt.ExpiredSignatureError:
        print("Token expired")
        return None
    except jwt.InvalidAudienceError:
        print("Invalid audience")
        return None
    except Exception as e:
        print("Token decode error:", e)
        return None



@profile_management_bp.route("/saveprofile", methods=["POST"])
def save_profile_info():
    user_id = get_current_user()
    if not user_id:
        return jsonify({"message": "Unauthorized - missing or invalid token", "valid": False}), 401

    data = request.json
    fields = {
        "first_name": data.get("new_first_name"),
        "last_name": data.get("new_last_name"),
        "username": data.get("new_username"),
        "address": data.get("new_address"),
        "mail": data.get("new_mail"),
        "phone": data.get("new_phone_number"),
    }

    update_data = {k: v for k, v in fields.items() if v is not None}

    if not update_data:
        return jsonify({"message": "No fields to update", "valid": False}), 400

    try:
        supabase.table("users").update(update_data).eq("auth_id", user_id).execute()
        return jsonify({"message": "Profile updated successfully", "valid": True}), 200

    except Exception as e:
        return jsonify({"message": f"Failed to update profile: {str(e)}", "valid": False}), 400
