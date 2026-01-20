from flask import Blueprint, jsonify, request
from ..supabase_client import supabase, admin_supabase
from app.auth.auth import verify_token
from datetime import datetime, timedelta, timezone


admin_bp = Blueprint("admin_bp", __name__)


@admin_bp.route("/admin/pending", methods=["GET"])
def get_pending_profiles():
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

    admin_resp = supabase.table("admins").select("*").eq("user_id", user_id).execute()

    if not (admin_resp.data and len(admin_resp.data) == 1):
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    resp = (
        supabase.table("organizers")
        .select("*")
        .eq("approved_by_admin", False)
        .execute()
    )

    organizers = resp.data

    logo_ids = list({e["logo_photo_id"] for e in organizers if e.get("logo_photo_id")})
    banner_ids = list(
        {e["banner_photo_id"] for e in organizers if e.get("banner_photo_id")}
    )

    photo_ids = logo_ids + banner_ids
    print(photo_ids, logo_ids, banner_ids)
    user_ids = list({e["user_id"] for e in organizers if e.get("user_id")})

    photo_resp = supabase.table("photos").select("*").in_("id", photo_ids).execute()
    user_resp = supabase.table("users").select("*").in_("id", user_ids).execute()

    photo_map = {o["id"]: o["url"] for o in photo_resp.data or []}
    address_map = {o["id"]: o["address"] for o in user_resp.data or []}
    phone_map = {o["id"]: o["phone"] for o in user_resp.data or []}
    mail_map = {o["id"]: o["mail"] for o in user_resp.data or []}

    for p in organizers:
        p["logo_photo_url"] = photo_map.get(p.get("logo_photo_id"))
        p["banner_photo_url"] = photo_map.get(p.get("banner_photo_id"))
        p["address"] = address_map.get(p.get("user_id"))
        p["phone"] = phone_map.get(p.get("user_id"))
        p["mail"] = mail_map.get(p.get("user_id"))

    return jsonify({"success": True, "profiles": organizers})


@admin_bp.route("/admin/approve-organizer/<int:organizer_id>", methods=["POST"])
def approve_organizer(organizer_id):
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

    admin_resp = supabase.table("admins").select("*").eq("user_id", user_id).execute()

    if not (admin_resp.data and len(admin_resp.data) == 1):
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    resp = (
        supabase.table("organizers")
        .update({"approved_by_admin": True})
        .eq("id", organizer_id)
        .execute()
    )
    if resp.data and len(resp.data) == 1:
        return jsonify({"success": True}), 200
    else:
        print(resp)


@admin_bp.route("/admin/users/search", methods=["GET"])
def search():
    mail_substring = request.args.get("q")  # returns None if not present

    if (mail_substring):
        user_resp = (
            supabase.table("users")
            .select("id,mail,profile_photo_id,first_name,last_name,username")
            .like("mail", f"%{mail_substring}%")
            .execute()
        )
    else:
        user_resp = (
            supabase.table("users")
            .select("id,mail,profile_photo_id,first_name,last_name,username")
            .execute()
        )

    users = user_resp.data
    photo_ids = list(
        {e["profile_photo_id"] for e in users if e.get("profile_photo_id")}
    )
    photo_resp = supabase.table("photos").select("*").in_("id", photo_ids).execute()
    photo_map = {o["id"]: o["url"] for o in photo_resp.data or []}

    for u in users:
        u["profile_photo_url"] = photo_map.get(u["profile_photo_id"])
    return jsonify({"success": True, "users": users})


@admin_bp.route("/admin/users/delete/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
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

    user_id_admin = user_resp.data["id"]

    admin_resp = (
        supabase.table("admins").select("*").eq("user_id", user_id_admin).execute()
    )

    if not (admin_resp.data and len(admin_resp.data) == 1):
        return jsonify({"success": False, "error": "Unauthorized"}), 401

    resp = supabase.table("users").delete().eq("id", user_id).execute()

    admin_supabase.auth.admin.delete_user(resp.data[0]["auth_id"])

    return jsonify({"success": True}), 200
