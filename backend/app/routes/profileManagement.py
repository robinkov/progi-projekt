import base64
from flask import Blueprint, request, jsonify
from ..supabase_client import supabase, admin_supabase
from .auth import verify_token

profile_bp = Blueprint("profile_management", __name__)

@profile_bp.route("/saveprofile", methods=["PUT"])
def update_profile():
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return jsonify({"error": "Missing token", "validToken": False}), 401

    token = auth_header.split(" ")[1] if auth_header.startswith("Bearer ") else auth_header
    valid, token_data = verify_token(token)
    if not valid:
        return jsonify({"validToken": False, "error": token_data.get("error")}), 401

    auth_id = token_data["sub"]

    # --- Dohvati korisnika ---
    try:
        user_resp = supabase.table("users").select("*").eq("auth_id", auth_id).execute()
    except Exception as e:
        return jsonify({"error": "Failed to fetch user", "details": str(e)}), 500

    if not getattr(user_resp, "data", None):
        return jsonify({"error": "User not found"}), 404

    user = user_resp.data[0]
    update_payload = {}

    allowed_fields = ["first_name", "last_name", "username", "address", "mail", "phone"]
    data = request.json or {}

    # Ažuriraj polja koja su poslana
    for field in allowed_fields:
        if field in data and data[field] is not None:
            update_payload[field] = data[field]

    # --- Obrada slike (ako je poslana kao base64) ---
    photo_base64 = data.get("profile_photo")
    if photo_base64:
        if "," in photo_base64:
            photo_base64 = photo_base64.split(",")[1]

        try:
            file_bytes = base64.b64decode(photo_base64)
        except Exception:
            return jsonify({"error": "Invalid base64 string for photo"}), 400

        filename = f"{auth_id}.png"
        storage_path = f"photos/{filename}"

        # upload u Supabase Storage
        try:
            # upload photo using admin client
            upload_resp = admin_supabase.storage.from_("photos").upload(
                path=storage_path,
                file=file_bytes,
                file_options={"contentType": "image/png", "upsert": "true"}
            )


        except Exception as e:
            return jsonify({"error": "Failed to upload photo", "details": str(e)}), 500

       # get public URL
        try:
            photo_url_resp = supabase.storage.from_("photos").get_public_url(storage_path)
            
            # If it's a dict (older version), get the URL from the dict, otherwise just use the string
            if isinstance(photo_url_resp, dict):
                photo_url = photo_url_resp.get("publicUrl") or photo_url_resp.get("public_url")
            else:
                photo_url = photo_url_resp  # it's already a string
        except Exception as e:
            return jsonify({"error": "Failed to get photo URL", "details": str(e)}), 500


        # spremi zapis u photos (admin client zbog RLS)
        try:
            insert_photo = admin_supabase.table("photos").insert({"url": photo_url}).execute()
        except Exception as e:
            return jsonify({"error": "Failed to save photo record", "details": str(e)}), 500

        if not getattr(insert_photo, "data", None):
            return jsonify({"error": "Failed to save photo record", "details": "No data returned"}), 500

        photo_id = insert_photo.data[0]["id"]
        update_payload["profile_photo_id"] = photo_id
    else:
        # ako nema nove slike, zadrži stari ID
        update_payload["profile_photo_id"] = user.get("profile_photo_id")

    # --- Update korisnika ---
    try:
        supabase.table("users").update(update_payload).eq("auth_id", auth_id).execute()
    except Exception as e:
        return jsonify({"error": "Failed to update user profile", "details": str(e)}), 500

    return jsonify({"validToken": True, "updated_fields": update_payload}), 200
