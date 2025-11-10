from flask import Blueprint, send_from_directory
import os

main_bp = Blueprint("main_bp", __name__)

@main_bp.route("/")
def serve_index():
    return send_from_directory("../frontend/app", "index.tsx")

@main_bp.route("/<path:path>")
def serve_static(path):
    if os.path.exists(os.path.join("../frontend/dist", path)):
        return send_from_directory("../frontend/dist", path)
    return send_from_directory("../frontend/dist", "index.html")
