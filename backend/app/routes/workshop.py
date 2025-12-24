from flask import Flask, request, jsonify, Blueprint
from ..supabase_client import supabase
from app.auth.auth import verify_token

workshop_bp = Blueprint("workshop_bp", __name__)

@workshop_bp.route("/workshops", methods=["POST"])
def create_workshop():

    auth_header = request.headers.get("Authorization")
    
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    valid, payload = verify_token(token)

    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload["sub"]

    data = request.json

    required_fields = [
        "title",
        "duration",
        "date_time",
        "location",
        "capacity",
        "price",
        "description",
    ]

    for field in required_fields:
        if field not in data:
            return jsonify(
                {"success": False, "error": f"Missing field: {field}"}
            ), 400

    user_resp = (
        supabase.table("users")
        .select("*")
        .eq("auth_id", auth_id)
        .single()
        .execute()
    )
    
    user_id = user_resp.data.get("id")
    
    organizer_resp = (
        supabase.table("organizers")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    
    organizer_id = organizer_resp.data.get("id")
    
    result = (
        supabase.table("workshops")
        .insert(
            {
                "organizer_id": organizer_id,
                "title": data["title"],
                "duration": data["duration"],
                "date_time": data["date_time"],
                "location": data["location"],
                "capacity": data["capacity"],
                "price": data["price"],
                "description": data["description"],
            }
        )
        .execute()
    )

    if not result.data:
        return jsonify({"success": False}), 500

    return jsonify(
        {
            "success": True,
            "workshop": result.data[0],
        }
    ), 201


@workshop_bp.route("/workshops/my", methods=["GET"])
def get_my_workshops():

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload["sub"]
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    user_resp = supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404

    user_id = user_resp.data["id"]

    organizer_resp = supabase.table("organizers").select("*").eq("user_id", user_id).single().execute()
    if not organizer_resp.data:
        return jsonify({"success": False, "error": "Organizer not found"}), 403

    organizer_id = organizer_resp.data["id"]

    workshops_resp = supabase.table("workshops").select("*").eq("organizer_id", organizer_id).order("date_time").execute()
    workshops = workshops_resp.data or []

    return jsonify({"success": True, "workshops": workshops}), 200

