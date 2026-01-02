from flask import Flask, request, jsonify, Blueprint
from ..supabase_client import supabase
from app.auth.auth import verify_token
from datetime import datetime, timedelta, timezone

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

    # Validate date_time
    try:
        workshop_datetime = datetime.fromisoformat(data["date_time"])
    except ValueError:
        return jsonify({"success": False, "error": "Invalid date_time format"}), 400

    if workshop_datetime < datetime.now():
        return (
            jsonify(
                {
                    "success": False,
                    "error": "Workshop date and time cannot be in the past",
                }
            ),
            400,
        )

    # Get user and organizer
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

    # Insert workshop
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

    return jsonify({"success": True, "workshop": result.data[0]}), 201


@workshop_bp.route("/workshops/my", methods=["POST"])
def get_my_workshops():

    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404
    user_id = user_resp.data["id"]

    # Get organizer
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

    # Get workshops
    workshops_resp = (
        supabase.table("workshops")
        .select("*")
        .eq("organizer_id", organizer_id)
        .order("date_time")
        .execute()
    )
    workshops = workshops_resp.data or []

    # Add date and time fields
    for w in workshops:
        dt = w.get("date_time")
        if dt:
            start_dt = datetime.fromisoformat(dt)
            w["date"] = start_dt.strftime("%d.%m.%y")
            w["time"] = start_dt.strftime("%H:%M")
        else:
            w["date"] = None
            w["time"] = None

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


@workshop_bp.route("/workshops/<int:workshop_id>/check-reservation", methods=["GET"])
def check_reservation(workshop_id):
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

    resp = (
        supabase.table("workshop_reservations")
        .select("*")
        .eq("workshop_id", workshop_id)
        .eq("participant_id", participant_id)
        .execute()
    )

    if len(resp.data) == 1:
        return jsonify({"registered": True}), 200
    else:
        return jsonify({"registered": False}), 200


@workshop_bp.route("/workshops/<int:workshop_id>/reserve", methods=["POST"])
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


@workshop_bp.route("/getworkshops", methods=["GET"])
def get_workshops():
    workshops_resp = (
        supabase.table("workshops")
        .select("*")
        .gte("date_time", datetime.now(timezone.utc).isoformat())
        .order("date_time")
        .execute()
    )

    workshops = workshops_resp.data or []

    if not workshops:
        return jsonify({"success": True, "workshops": []}), 200

    organizer_ids = list(
        {w["organizer_id"] for w in workshops if w.get("organizer_id")}
    )

    organizers_resp = (
        supabase.table("organizers")
        .select("id, profile_name")
        .in_("id", organizer_ids)
        .execute()
    )

    organizer_map = {o["id"]: o["profile_name"] for o in organizers_resp.data or []}

    for w in workshops:

        profile_name = organizer_map.get(w.get("organizer_id"))
        w["organizer_name"] = profile_name

        start_dt = datetime.fromisoformat(w["date_time"])

        h, m, s = map(int, w["duration"].split(":"))
        duration_delta = timedelta(hours=h, minutes=m, seconds=s)

        end_dt = start_dt + duration_delta

        w["date"] = start_dt.strftime("%d.%m")
        w["timeFrom"] = start_dt.strftime("%H:%M")
        w["timeTo"] = end_dt.strftime("%H:%M")

    return jsonify({"success": True, "workshops": workshops}), 200


@workshop_bp.route("/workshops/delete/<int:workshop_id>", methods=["DELETE"])
def delete_workshop(workshop_id):
    try:
        delete_resp = (
            supabase.table("workshops").delete().eq("id", workshop_id).execute()
        )
        if delete_resp.data is None:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Workshop not found or could not be deleted",
                    }
                ),
                404,
            )

        return (
            jsonify({"success": True, "message": f"Workshop {workshop_id} deleted"}),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@workshop_bp.route("/getreservations", methods=["GET"])
def get_reservations():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404
    user_id = user_resp.data["id"]

    participant_resp = (
        supabase.table("participants")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not participant_resp.data:
        return jsonify({"success": False, "error": "Participant not found"}), 404
    participant_id = participant_resp.data["id"]

    reservations_resp = (
        supabase.table("workshop_reservations")
        .select("*")
        .eq("participant_id", participant_id)
        .execute()
    )

    reservations = reservations_resp.data or []
    workshop_ids = [r["workshop_id"] for r in reservations]

    if not workshop_ids:
        return jsonify({"success": True, "workshops": []}), 200

    workshops_resp = (
        supabase.table("workshops")
        .select("*")
        .in_("id", workshop_ids)
        .gte("date_time", datetime.now(timezone.utc).isoformat())
        .order("date_time")
        .execute()
    )

    workshops = workshops_resp.data or []

    organizer_ids = list(
        {w["organizer_id"] for w in workshops if w.get("organizer_id")}
    )

    if not organizer_ids:
        return jsonify({"success": True, "workshops": workshops}), 200

    organizers_resp = (
        supabase.table("organizers")
        .select("id, profile_name")
        .in_("id", organizer_ids)
        .execute()
    )

    organizer_map = {o["id"]: o["profile_name"] for o in organizers_resp.data or []}
    for w in workshops:
        w["organizer"] = organizer_map.get(w.get("organizer_id"))

        if w.get("date_time"):
            start_dt = datetime.fromisoformat(w["date_time"])

            w["date"] = start_dt.strftime("%d.%m.%y")

            duration_raw = w.get("duration")

            if duration_raw:
                try:
                    h, m, s = map(int, duration_raw.split(":"))
                    duration_delta = timedelta(hours=h, minutes=m, seconds=s)

                    end_dt = start_dt + duration_delta

                    w["time"] = (
                        f"{start_dt.strftime('%H:%M')} - {end_dt.strftime('%H:%M')}"
                    )
                except Exception:
                    w["time"] = None
            else:
                w["time"] = None
    return jsonify({"success": True, "workshops": workshops}), 200


@workshop_bp.route("/reservations/delete/<int:workshop_id>", methods=["DELETE"])
def delete_reservation(workshop_id):
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]

    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    auth_id = payload.get("sub")
    if not auth_id:
        return jsonify({"success": False, "error": "Token missing user ID"}), 401

    # Get user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )
    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404
    user_id = user_resp.data["id"]

    participant_resp = (
        supabase.table("participants")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not participant_resp.data:
        return jsonify({"success": False, "error": "Participant not found"}), 404
    participant_id = participant_resp.data["id"]
    try:
        delete_resp = (
            supabase.table("workshop_reservations")
            .delete()
            .eq("workshop_id", workshop_id)
            .eq("participant_id", participant_id)
            .execute()
        )
        if delete_resp.data is None:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "Workshop not found or could not be deleted",
                    }
                ),
                404,
            )

        return (
            jsonify({"success": True, "message": f"Workshop {workshop_id} deleted"}),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
