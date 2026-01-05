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
        # By default show only products that are not sold
        products_resp = (
            supabase.table("products")
            .select("*")
            .eq("sold", False)
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

        return jsonify({"success": True, "product": product_resp.data}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

