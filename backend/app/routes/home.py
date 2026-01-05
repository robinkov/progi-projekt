from flask import jsonify, Blueprint, request
from ..supabase_client import supabase
from app.auth.auth import verify_token
from datetime import datetime, timedelta, timezone


home_bp = Blueprint("home_bp", __name__)


@home_bp.route("/", methods=["GET"])
def get_home():
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

    user = user_resp.data

    needsUsername = True
    if user["username"]:
        needsUsername = False

    organizer_resp = (
        supabase.table("organizers").select("*").eq("user_id", user["id"]).execute()
    )

    needsApproval = False
    needsMembership = False
    if organizer_resp.data and len(organizer_resp.data) == 1:
        organizer = organizer_resp.data[0]
        needsApproval = True
        needsMembership = True
        if organizer["approved_by_admin"] == True:
            needsApproval = False
        if (
            organizer["membership_expiry_date"]
            and organizer["membership_expiry_date"] > datetime.now()
        ):
            needsMembership = False

    subs_resp = (
        supabase.table("notification_subscriptions")
        .select("*")
        .eq("user_id", user["id"])
        .execute()
    )

    types = list({w["type"] for w in subs_resp.data if w.get("type")})

    newWorkshopNotifications = False
    newProductNotifications = False
    if "workshop" in types:
        newWorkshopNotifications = True
    if "product" in types:
        newProductNotifications = True

    if not newWorkshopNotifications and not newProductNotifications:
        return (
            jsonify(
                {
                    "success": True,
                    "needsUsername": needsUsername,
                    "needsApproval": needsApproval,
                    "needsMembership": needsMembership,
                    "newWorkshopNotifications": newWorkshopNotifications,
                    "newProductNotifications": newProductNotifications,
                    "notifications": [],
                }
            ),
            200,
        )

    read_resp = (
        supabase.table("read_notifications")
        .select("*")
        .eq("user_id", user["id"])
        .execute()
    )

    notification_ids = list(
        {w["notification_id"] for w in read_resp.data if w.get("notification_id")}
    )

    notifications_resp = (
        supabase.table("notifications")
        .select("*")
        .in_("type", types)
        .not_.in_("id", notification_ids)
        .gte("created_at", datetime.now() - timedelta(7))
        .order("created_at", desc=True)
        .execute()
    )

    return (
        jsonify(
            {
                "success": True,
                "needsUsername": needsUsername,
                "needsApproval": needsApproval,
                "needsMembership": needsMembership,
                "newWorkshopNotifications": newWorkshopNotifications,
                "newProductNotifications": newProductNotifications,
                "notifications": notifications_resp.data,
            }
        ),
        200,
    )


@home_bp.route("/toggle-notification-settings", methods=["POST"])
def toggle_notification_settings():
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

    user = user_resp.data
    data = request.json

    type = data["type"]
    enabled = data["enabled"]

    if enabled:
        res = (
            supabase.table("notification_subscriptions")
            .insert(
                {"type": type, "user_id": user["id"], "started_at": str(datetime.now())}
            )
            .execute()
        )
    else:
        res = (
            supabase.table("notification_subscriptions")
            .delete()
            .eq("type", type)
            .eq("user_id", user["id"])
            .execute()
        )
    return jsonify({"success": True}), 200


@home_bp.route("/mark-notification-read", methods=["POST"])
def mark_as_read():
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

    user = user_resp.data
    data = request.json

    notification_id = data["id"]

    resp = (
        supabase.table("read_notifications")
        .insert(
            {
                "notification_id": notification_id,
                "user_id": user["id"],
                "marked_as_read": True,
            }
        )
        .execute()
    )

    return jsonify({"success": True}), 200
