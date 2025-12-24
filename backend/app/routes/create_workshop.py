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

