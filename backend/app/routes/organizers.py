from flask import Blueprint, jsonify, request
from ..supabase_client import supabase
from app.auth.auth import verify_token
from datetime import datetime, timedelta, timezone
from app.auth.membership import has_membership


organizers_bp = Blueprint("organizers_bp", __name__)


@organizers_bp.route("/organizers/<int:organizer_id>", methods=["GET"])
def get_organizer(organizer_id: int):
    """Fetch organizer info by ID."""
    try:
        organizer_resp = (
            supabase.table("organizers")
            .select("*")
            .eq("id", organizer_id)
            .maybe_single()
            .execute()
        )

        if not organizer_resp or not organizer_resp.data:
            return jsonify({"success": False, "error": "Organizer not found"}), 404

        organizer = organizer_resp.data

        user_resp = (
            supabase.table("users")
            .select("*")
            .eq("id", organizer["user_id"])
            .single()
            .execute()
        )

        user = user_resp.data

        logo_id = organizer.get("logo_photo_id")
        banner_id = organizer.get("banner_photo_id")

        logo_url = None
        banner_url = None

        if logo_id:
            logo_resp = (
                supabase.table("photos")
                .select("*")
                .eq("id", logo_id)
                .maybe_single()
                .execute()
            )
            if logo_resp and logo_resp.data:
                logo_url = logo_resp.data.get("url")

        if banner_id:
            banner_resp = (
                supabase.table("photos")
                .select("*")
                .eq("id", banner_id)
                .maybe_single()
                .execute()
            )
            if banner_resp and banner_resp.data:
                banner_url = banner_resp.data.get("url")
        resp = (
            supabase.table("organizer_photos")
            .select("*")
            .eq("organizer_id", organizer["id"])
            .execute()
        )

        photo_ids = list({w["photo_id"] for w in resp.data if w.get("photo_id")})

        photo_resp = supabase.table("photos").select("*").in_("id", photo_ids).execute()
        return (
            jsonify(
                {
                    "success": True,
                    "profile_name": organizer.get("profile_name"),
                    "description": organizer.get("description"),
                    "logo_url": logo_url,
                    "banner_url": banner_url,
                    "approved_by_admin": organizer.get("approved_by_admin"),
                    "membership_plan_id": organizer.get("membership_plan_id"),
                    "membership_expiry_date": organizer.get("membership_expiry_date"),
                    "photos": photo_resp.data,
                    "mail": user["mail"],
                    "phone": user["phone"],
                    "address": user["address"],
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@organizers_bp.route("/organizer/check-if-allowed", methods=["GET"])
def check_if_allowed():
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

    organizers_resp = (
        supabase.table("organizers")
        .select("*")
        .eq("user_id", user_id)
        .eq("approved_by_admin", True)
        .execute()
    )

    if (
        organizers_resp.data
        and len(organizers_resp.data) == 1
        and has_membership(organizers_resp.data[0]["id"])
    ):
        return jsonify({"success": True, "allowed": True}), 200
    else:
        return jsonify({"success": True, "allowed": False}), 200
