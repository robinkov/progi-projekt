from flask import jsonify, Blueprint, request
from ..supabase_client import supabase
from app.auth.auth import verify_token
from datetime import datetime, timedelta


exhibition_bp = Blueprint("exhibition_bp", __name__)


@exhibition_bp.route("/exhibitions", methods=["POST"])
def create_exhibition():

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
        "date_time",
        "location",
        "price",
        "description",
    ]

    for field in required_fields:
        if field not in data:
            return jsonify(
                {"success": False, "error": f"Missing field: {field}"},
                400
            )

    # get user by auth_id
    user_resp = (
        supabase.table("users")
        .select("*")
        .eq("auth_id", auth_id)
        .single()
        .execute()
    )

    if not user_resp.data:
        return jsonify({"success": False, "error": "User not found"}), 404

    user_id = user_resp.data["id"]

    # get organizer
    organizer_resp = (
        supabase.table("organizers")
        .select("*")
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not organizer_resp.data:
        return jsonify({"success": False, "error": "Organizer not found"}), 404

    organizer_id = organizer_resp.data["id"]

    # insert exhibition
    result = (
        supabase.table("exhibitions")
        .insert({
            "organizer_id": organizer_id,
            "title": data["title"],
            "date_time": data["date_time"],
            "location": data["location"],
            "description": data["description"],
        })
        .execute()
    )

    if not result.data:
        return jsonify({"success": False}), 500

    return jsonify({
        "success": True,
        "exhibition": result.data[0],
    }), 201




@exhibition_bp.route("/getexhibitions", methods=["GET"])
def get_exhibitions():
    exhibitions_resp = (
        supabase.table("exhibitions")
        .select("*")
        .order("date_time")
        .execute()
    )

    exhibitions = exhibitions_resp.data or []

    if not exhibitions:
        return jsonify({"success": True, "exhibitions": []}), 200

    organizer_ids = list({
        e["organizer_id"]
        for e in exhibitions
        if e.get("organizer_id")
    })

    organizers_resp = (
        supabase.table("organizers")
        .select("id, user_id")
        .in_("id", organizer_ids)
        .execute()
    )

    organizer_map = {
        o["id"]: o["user_id"]
        for o in organizers_resp.data or []
    }

    users_resp = (
        supabase.table("users")
        .select("id, first_name, last_name")
        .in_("id", list(organizer_map.values()))
        .execute()
    )

    user_map = {
        u["id"]: f"{u['first_name']} {u['last_name']}"
        for u in users_resp.data or []
    }

    for e in exhibitions:
        user_id = organizer_map.get(e.get("organizer_id"))
        e["organizer_name"] = user_map.get(user_id, "Organizator")

        start_dt = datetime.fromisoformat(e["date_time"])

        e["date"] = start_dt.strftime("%d.%m")
        e["timeFrom"] = start_dt.strftime("%H:%M")
        e["timeTo"] = None

    return jsonify(
        {
            "success": True,
            "exhibitions": exhibitions
        }
    ), 200


@exhibition_bp.route("/exhibitions/<int:exhibition_id>", methods=["GET"])
def get_exhibition(exhibition_id):

    exhibition_resp = (
        supabase.table("exhibitions")
        .select("*")
        .eq("id", exhibition_id)
        .single()
        .execute()
    )

    exhibition = exhibition_resp.data

    if not exhibition:
        return jsonify({
            "success": False,
            "message": "Exhibition not found"
        }), 404

    organizer_resp = (
        supabase.table("organizers")
        .select("*")
        .eq("id", exhibition["organizer_id"])
        .single()
        .execute()
    )

    organizer = organizer_resp.data

    user_resp = (
        supabase.table("users")
        .select("first_name, last_name")
        .eq("id", organizer["user_id"])
        .single()
        .execute()
    )

    user = user_resp.data

    organizer["full_name"] = f"{user['first_name']} {user['last_name']}"

    start_dt = datetime.fromisoformat(exhibition["date_time"])

    exhibition["date"] = start_dt.strftime("%d.%m.%Y")
    exhibition["timeFrom"] = start_dt.strftime("%H:%M")


    return jsonify({
        "success": True,
        "exhibition": exhibition,
        "organizer": organizer
    }), 200
