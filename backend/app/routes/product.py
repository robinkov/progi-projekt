from flask import Blueprint, request, jsonify
from ..supabase_client import supabase
from app.auth.auth import verify_token

product_bp = Blueprint("product_bp", __name__)


@product_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id: int):
    """Fetch a single product by ID for ProductInstance page."""
    try:
        product_resp = (
            supabase.table("products")
            .select("*")
            .eq("id", product_id)
            .single()
            .execute()
        )

        if not product_resp.data:
            return jsonify({"success": False, "error": "Product not found"}), 404

        return jsonify({"success": True, "product": product_resp.data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@product_bp.route("/products/<int:product_id>/checkout", methods=["POST"])
def checkout_product(product_id: int):
    """
    Minimal checkout route used by ProductInstance.
    - Verifies auth token
    - Ensures product exists and isn't already sold
    - Returns a placeholder checkout URL if payment is enabled (to be wired later)
    """

    # Verify token
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"success": False, "error": "Missing token"}), 401

    token = auth_header.split(" ")[1]
    valid, payload = verify_token(token)
    if not valid:
        return jsonify({"success": False, "error": "Invalid token"}), 401

    # Fetch product
    prod_resp = (
        supabase.table("products").select("*").eq("id", product_id).single().execute()
    )

    if not prod_resp.data:
        return jsonify({"success": False, "error": "Product not found"}), 404

    product = prod_resp.data

    # Check sold state
    if product.get("sold"):
        return jsonify({"success": False, "error": "Product already sold"}), 409

    # Placeholder: When payment integration is available, generate checkout URL
    checkout_enabled = True  # Toggle/payment feature flag can be wired here
    checkout_url = None

    if checkout_enabled:
        # This should point to your payment provider/session (e.g., Stripe)
        checkout_url = f"https://example.com/checkout/products/{product_id}"

    return jsonify({
        "success": True,
        "checkout_url": checkout_url,
        "enabled": checkout_enabled,
    }), 200
