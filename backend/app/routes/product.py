from flask import Blueprint, jsonify
from ..supabase_client import supabase

product_bp = Blueprint("product_bp", __name__)


@product_bp.route("/products", methods=["GET"])
def list_products():
    """Fetch a list of products for the shop page.

    Joins products with organizers to expose seller_name on each product.
    products.seller_id references organizers.id.
    """
    try:
        # By default show all products (regardless of sold status)
        products_resp = (
            supabase.table("products")
            .select("*")
            .execute()
        )

        products = products_resp.data or []

        if not products:
            return jsonify({"success": True, "products": []}), 200

        # Collect organizer IDs from products.seller_id
        seller_ids = list({p["seller_id"] for p in products if p.get("seller_id")})

        organizers_resp = (
            supabase.table("organizers")
            .select("id, profile_name")
            .in_("id", seller_ids)
            .execute()
        )

        organizer_map = {
            o["id"]: o.get("profile_name") for o in (organizers_resp.data or [])
        }

        for p in products:
            seller_id = p.get("seller_id")
            p["seller_name"] = organizer_map.get(seller_id)

        # Attach photo URL based on photo_id
        photo_ids = list({p["photo_id"] for p in products if p.get("photo_id")})

        if photo_ids:
            photos_resp = (
                supabase.table("photos")
                .select("id, url")
                .in_("id", photo_ids)
                .execute()
            )

            photo_map = {
                ph["id"]: ph.get("url") for ph in (photos_resp.data or [])
            }

            for p in products:
                pid = p.get("photo_id")
                p["photo"] = photo_map.get(pid)

        return jsonify({"success": True, "products": products}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


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

        product = product_resp.data

        # Attach photo URL if photo_id is present
        photo_url = None
        if product.get("photo_id"):
            photo_resp = (
                supabase.table("photos")
                .select("url")
                .eq("id", product.get("photo_id"))
                .single()
                .execute()
            )
            photo_url = photo_resp.data.get("url") if photo_resp.data else None

        product["photo"] = photo_url

        return jsonify({"success": True, "product": product}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

