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
            return jsonify({"success": False, "error": f"Missing field: {field}"}), 400

    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
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

    return (
        jsonify(
            {
                "success": True,
                "workshop": result.data[0],
            }
        ),
        201,
    )


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

    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404

    user_id = user_resp.data["id"]

    organizer_resp = (
        supabase.table("organizers")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    if not organizer_resp.data:
        return jsonify({"success": False, "error": "Organizer not found"}), 403

    organizer_id = organizer_resp.data["id"]

    workshops_resp = (
        supabase.table("workshops")
        .select("*")
        .eq("organizer_id", organizer_id)
        .order("date_time")
        .execute()
    )
    workshops = workshops_resp.data or []

    return jsonify({"success": True, "workshops": workshops}), 200


@workshop_bp.route("/workshops/<int:workshop_id>", methods=["GET"])
def get_specific_workshop(workshop_id):

    # Fetch workshop
    workshop_resp = (
        supabase.table("workshops").select("*").eq("id", workshop_id).single().execute()
    )

    if not workshop_resp:
        return jsonify({"success": False, "error": "Workshop not found"}), 404

    return (
        jsonify(
            {
                "success": True,
                "workshop": workshop_resp.data,
            }
        ),
        200,
    )


@workshop_bp.route("/workshops/<int:workshop_id>/reservations/count", methods=["GET"])
def get_reservation_count(workshop_id):

    resp = (
        supabase.table("workshop_reservations")
        .select("id", count="exact")
        .eq("workshop_id", workshop_id)
        .execute()
    )

    return jsonify({"count": resp.count or 0}), 200


@workshop_bp.route("/workshops/<int:workshop_id>/reservations", methods=["POST"])
def make_reservation(workshop_id):
    auth_header = request.headers.get("Authorization")

    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    valid, payload = verify_token(token)

    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Invalid token payload"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("id").eq("auth_id", auth_id).single().execute()
    )

    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404

    user_id = user_resp.data["id"]

    participant_resp = (
        supabase.table("participants")
        .select("id")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    participant_id = participant_resp.data["id"]

    # Check workshop exists
    workshop_resp = (
        supabase.table("workshops")
        .select("id, capacity")
        .eq("id", workshop_id)
        .single()
        .execute()
    )

    if not workshop_resp.data:
        return jsonify({"success": False, "error": "Workshop not found"}), 404

    capacity = workshop_resp.data["capacity"]

    # Check existing reservation (prevent duplicates)
    existing_reservation = (
        supabase.table("workshop_reservations")
        .select("id")
        .eq("workshop_id", workshop_id)
        .eq("participant_id", participant_id)
        .maybe_single()
        .execute()
    )

    if existing_reservation:
        return (
            jsonify(
                {
                    "success": False,
                    "error": "You already have a reservation for this workshop",
                }
            ),
            409,
        )

    # Count current reservations
    reservation_count_resp = (
        supabase.table("workshop_reservations")
        .select("id", count="exact")
        .eq("workshop_id", workshop_id)
        .execute()
    )

    current_count = reservation_count_resp.count or 0

    if current_count >= capacity:
        return jsonify({"success": False, "error": "Workshop is full"}), 409

    # Create reservation
    reservation_resp = (
        supabase.table("workshop_reservations")
        .insert(
            {
                "workshop_id": workshop_id,
                "participant_id": participant_id,
            }
        )
        .execute()
    )

    if not reservation_resp.data:
        return jsonify({"success": False, "error": "Reservation failed"}), 500

    return (
        jsonify(
            {
                "success": True,
                "reservation": reservation_resp.data[0],
            }
        ),
        201,
    )
