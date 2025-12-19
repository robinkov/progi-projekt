from flask import Blueprint, request, jsonify
from ..supabase_client import supabase, admin_supabase
from app.auth.auth import verify_token

organizerProfile_bp = Blueprint("organizer_profile_management", __name__)

#GET PROFILE

@organizerProfile_bp.route("/organizer/profile", methods=["POST"])
def get_organizer_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token"}), 401

    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    valid, token_data = verify_token(token)

    if not valid:
        return jsonify({"error": "Invalid token"}), 401

    auth_id = token_data["sub"]
    
    #Fetch user
    user_resp = (
        supabase
        .table("users")
        .select("*")
        .eq("auth_id", auth_id)
        .single()
        .execute()
    )
    
    user_id = user_resp.data.get("id")
    
    # Fetch organizer row
    organizer_resp = (
        supabase
        .table("organizers")
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
            supabase
            .table("photos")
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
            supabase
            .table("photos")
            .select("url")
            .eq("id", organizer["banner_photo_id"])
            .single()
            .execute()
        )
        banner_url = banner_resp.data.get("url") if banner_resp.data else None

    return jsonify({
        "profile_name": organizer.get("profile_name"),
        "description": organizer.get("description"),
        "membership_plan_id": organizer.get("membership_plan_id"),
        "membership_expiry_date": organizer.get("membership_expiry_date"),
        "approved_by_admin": organizer.get("approved_by_admin"),
        "logo_url": logo_url,
        "banner_url": banner_url,
    }), 200
    
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
            supabase
            .table("users")
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
        supabase.table("organizers").update({
            "profile_name": profile_name,
            "description": description,
        }).eq("user_id", user_id).execute()

        # Handle logo
        if logo_url:
            photo_resp = supabase.table("photos").insert({"url": logo_url}).execute()
            new_photo_id = photo_resp.data[0]["id"] if photo_resp.data else None
            if new_photo_id:
                supabase.table("organizers").update({"logo_photo_id": new_photo_id}).eq("user_id", user_id).execute()

        # Handle banner
        if banner_url:
            photo_resp = supabase.table("photos").insert({"url": banner_url}).execute()
            new_photo_id = photo_resp.data[0]["id"] if photo_resp.data else None
            if new_photo_id:
                supabase.table("organizers").update({"banner_photo_id": new_photo_id}).eq("user_id", user_id).execute()

        return jsonify({"message": "Organizer profile updated"}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
