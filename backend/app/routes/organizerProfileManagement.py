from flask import Blueprint, request, jsonify
from ..supabase_client import supabase, admin_supabase
from app.auth.auth import verify_token
from collections import Counter


organizerProfile_bp = Blueprint("organizer_profile_management", __name__)

# GET PROFILE


@organizerProfile_bp.route("/organizer/profile", methods=["POST"])
def get_organizer_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token"}), 401

    token = (
        auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    )
    valid, token_data = verify_token(token)

    if not valid:
        return jsonify({"error": "Invalid token"}), 401

    auth_id = token_data["sub"]

    # Fetch user
    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )

    user_id = user_resp.data.get("id")

    # Fetch organizer row
    organizer_resp = (
        supabase.table("organizers")
        .select(
            "id, profile_name, description, membership_plan_id, membership_expiry_date, approved_by_admin, logo_photo_id, banner_photo_id"
        )
        .eq("user_id", user_id)
        .single()
        .execute()
    )

    if not organizer_resp.data:
        return jsonify({"error": "Organizer profile not found"}), 404

    organizer = organizer_resp.data

    # Resolve logo
    logo_url = None
    if organizer.get("logo_photo_id"):
        logo_resp = (
            supabase.table("photos")
            .select("url")
            .eq("id", organizer["logo_photo_id"])
            .single()
            .execute()
        )
        logo_url = logo_resp.data.get("url") if logo_resp.data else None

    # Resolve banner
    banner_url = None
    if organizer.get("banner_photo_id"):
        banner_resp = (
            supabase.table("photos")
            .select("url")
            .eq("id", organizer["banner_photo_id"])
            .single()
            .execute()
        )
        banner_url = banner_resp.data.get("url") if banner_resp.data else None

    return (
        jsonify(
            {
                "profile_name": organizer.get("profile_name"),
                "description": organizer.get("description"),
                "membership_plan_id": organizer.get("membership_plan_id"),
                "membership_expiry_date": organizer.get("membership_expiry_date"),
                "approved_by_admin": organizer.get("approved_by_admin"),
                "logo_url": logo_url,
                "banner_url": banner_url,
            }
        ),
        200,
    )


# UPDATE PROFILE


@organizerProfile_bp.route("/organizer/profile/update", methods=["POST"])
def update_organizer_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]

    try:
        user_resp = admin_supabase.auth.get_user(token)
        auth_id = user_resp.user.id

        user_resp = (
            supabase.table("users")
            .select("*")
            .eq("auth_id", auth_id)
            .single()
            .execute()
        )

        user_id = user_resp.data.get("id")

        data = request.json
        profile_name = data.get("profile_name")
        description = data.get("description")
        logo_url = data.get("logo_url")
        banner_url = data.get("banner_url")

        # Update the organizer table
        supabase.table("organizers").update(
            {
                "profile_name": profile_name,
                "description": description,
            }
        ).eq("user_id", user_id).execute()

        # Handle logo
        if logo_url:
            photo_resp = supabase.table("photos").insert({"url": logo_url}).execute()
            new_photo_id = photo_resp.data[0]["id"] if photo_resp.data else None
            if new_photo_id:
                supabase.table("organizers").update({"logo_photo_id": new_photo_id}).eq(
                    "user_id", user_id
                ).execute()

        # Handle banner
        if banner_url:
            photo_resp = supabase.table("photos").insert({"url": banner_url}).execute()
            new_photo_id = photo_resp.data[0]["id"] if photo_resp.data else None
            if new_photo_id:
                supabase.table("organizers").update(
                    {"banner_photo_id": new_photo_id}
                ).eq("user_id", user_id).execute()

        return jsonify({"message": "Organizer profile updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400


@organizerProfile_bp.route("/organizer/pending", methods=["GET"])
def get_pending():
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]

    user_resp = admin_supabase.auth.get_user(token)
    auth_id = user_resp.user.id

    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )

    user_id = user_resp.data.get("id")

    organizer_resp = (
        supabase.table("organizers")
        .select("id")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    organizer_id = organizer_resp.data["id"]

    exhibition_resp = (
        supabase.table("exhibitions")
        .select("*")
        .eq("organizer_id", organizer_id)
        .order("date_time")
        .execute()
    )

    exhibitions = exhibition_resp.data

    exhibition_ids = list({e["id"] for e in exhibitions if e.get("id")})
    title_map = {r["id"]: r["title"] for r in exhibitions}
    dt_map = {r["id"]: r["date_time"] for r in exhibitions}

    registrations_resp = (
        supabase.table("exhibition_registrations")
        .select("*")
        .in_("exhibition_id", exhibition_ids)
        .order("id")
        .execute()
    )

    registrations = registrations_resp.data

    approved_counts = {eid: 0 for eid in exhibition_ids}

    for r in registrations:
        if r.get("approved") is True:
            approved_counts[r["exhibition_id"]] += 1

    participant_ids = list({e["participant_id"] for e in registrations if e.get("id")})

    participants_resp = (
        supabase.table("participants").select("*").in_("id", participant_ids).execute()
    )

    participants = participants_resp.data
    user_ids = list({e["user_id"] for e in participants if e.get("id")})
    user_map = {r["id"]: r["user_id"] for r in participants}

    users_resp = supabase.table("users").select("*").in_("id", user_ids).execute()

    users = users_resp.data
    username_map = {r["id"]: r["username"] for r in users}
    photo_map = {r["id"]: r["profile_photo_id"] for r in users}

    photo_ids = list(
        {e["profile_photo_id"] for e in users if e.get("id") and e["profile_photo_id"]}
    )

    photos_resp = supabase.table("photos").select("*").in_("id", photo_ids).execute()
    photos = photos_resp.data
    url_map = {r["id"]: r["url"] for r in photos}

    registrations = [r for r in registrations if not r.get("approved", False)]

    for r in registrations:
        user_id = user_map.get(r.get("participant_id"))
        photo_id = photo_map.get(user_id)

        r["participant_username"] = username_map.get(user_id)
        r["participant_profile_photo_url"] = url_map.get(photo_id)
        r["exhibition_title"] = title_map.get(r.get("exhibition_id"))
        r["exhibition_date_time"] = dt_map.get(r.get("exhibition_id"))
        r["number_of_already_approved_participants"] = approved_counts[
            r["exhibition_id"]
        ]
    return jsonify({"success": True, "registrations": registrations}), 200


@organizerProfile_bp.route("/organizer/approve/<int:reservation_id>", methods=["POST"])
def approve_reservation(reservation_id):
    auth_header = request.headers.get("Authorization")
    print(auth_header)
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Unauthorized"}), 401

    token = auth_header.split(" ")[1]

    user_resp = admin_supabase.auth.get_user(token)
    auth_id = user_resp.user.id

    user_resp = (
        supabase.table("users").select("*").eq("auth_id", auth_id).single().execute()
    )

    user_id = user_resp.data.get("id")

    organizer_resp = (
        supabase.table("organizers")
        .select("id")
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    organizer_id = organizer_resp.data["id"]

    exhibition_resp = (
        supabase.table("exhibitions")
        .select("*")
        .eq("organizer_id", organizer_id)
        .order("date_time")
        .execute()
    )

    exhibitions = exhibition_resp.data

    exhibition_ids = list({e["id"] for e in exhibitions if e.get("id")})

    reservation_resp = (
        supabase.table("exhibition_registrations")
        .update({"approved": True})
        .eq("id", reservation_id)
        .in_("exhibition_id", exhibition_ids)
        .execute()
    )
    return jsonify({"success": True})
