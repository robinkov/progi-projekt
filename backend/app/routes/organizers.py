from flask import Blueprint, jsonify
from ..supabase_client import supabase

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

        logo_id = organizer.get("logo_photo_id")
        banner_id = organizer.get("banner_photo_id")

        logo_url = None
        banner_url = None

        if logo_id:
            logo_resp = (
                supabase.table("photos").select("*").eq("id", logo_id).maybe_single().execute()
            )
            if logo_resp and logo_resp.data:
                logo_url = logo_resp.data.get("url")

        if banner_id:
            banner_resp = (
                supabase.table("photos").select("*").eq("id", banner_id).maybe_single().execute()
            )
            if banner_resp and banner_resp.data:
                banner_url = banner_resp.data.get("url")

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
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
