from flask import Blueprint, jsonify, request
from datetime import datetime, timezone
from collections import Counter
from ..supabase_client import supabase
from app.auth.auth import verify_token

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

        # Attach review metadata (review_count, has_reviews)
        product_ids = [p["id"] for p in products if p.get("id") is not None]

        review_counts: dict[int, int] = {}
        if product_ids:
            reviews_resp = (
                supabase.table("product_reviews")
                .select("product_id")
                .in_("product_id", product_ids)
                .execute()
            )

            review_counts = Counter(
                r["product_id"] for r in (reviews_resp.data or []) if r.get("product_id") is not None
            )

        for p in products:
            pid = p.get("id")
            count = review_counts.get(pid, 0) if pid is not None else 0
            p["review_count"] = count
            p["has_reviews"] = count > 0

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


@product_bp.route("/sellers/<int:seller_id>/products", methods=["GET"])
def list_products_for_seller(seller_id: int):
    """Fetch products for a specific seller.

    Mirrors list_products, but filtered by seller_id and includes seller_name
    and photo URL for each product.
    """
    try:
        products_resp = (
            supabase.table("products")
            .select("*")
            .eq("seller_id", seller_id)
            .execute()
        )

        products = products_resp.data or []

        if not products:
            return jsonify({"success": True, "products": []}), 200

        organizer_resp = (
            supabase.table("organizers")
            .select("id, profile_name")
            .eq("id", seller_id)
            .maybe_single()
            .execute()
        )

        organizer = organizer_resp.data if organizer_resp else None
        seller_name = organizer.get("profile_name") if organizer else None

        for p in products:
            p["seller_name"] = seller_name

        photo_ids = list({p["photo_id"] for p in products if p.get("photo_id")})

        if photo_ids:
            photos_resp = (
                supabase.table("photos")
                .select("id, url")
                .in_("id", photo_ids)
                .execute()
            )

            photo_map = {ph["id"]: ph.get("url") for ph in (photos_resp.data or [])}

            for p in products:
                pid = p.get("photo_id")
                p["photo"] = photo_map.get(pid)

        # Attach review metadata (review_count, has_reviews) for this seller's products
        product_ids = [p["id"] for p in products if p.get("id") is not None]

        review_counts: dict[int, int] = {}
        if product_ids:
            reviews_resp = (
                supabase.table("product_reviews")
                .select("product_id")
                .in_("product_id", product_ids)
                .execute()
            )

            review_counts = Counter(
                r["product_id"] for r in (reviews_resp.data or []) if r.get("product_id") is not None
            )

        for p in products:
            pid = p.get("id")
            count = review_counts.get(pid, 0) if pid is not None else 0
            p["review_count"] = count
            p["has_reviews"] = count > 0

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


@product_bp.route("/products/<int:product_id>/reviews", methods=["GET"])
def list_product_reviews(product_id: int):
    """List all reviews for a product, with basic reviewer info."""
    try:
        reviews_resp = (
            supabase.table("product_reviews")
            .select("*")
            .eq("product_id", product_id)
            .order("created_at", desc=True)
            .execute()
        )

        reviews = reviews_resp.data or []

        if not reviews:
            return jsonify({"success": True, "reviews": []}), 200

        # Attach reviewer name via participants -> users
        participant_ids = list({r["participant_id"] for r in reviews if r.get("participant_id")})

        participants_resp = (
            supabase.table("participants")
            .select("id, user_id")
            .in_("id", participant_ids)
            .execute()
        )

        participant_map = {p["id"]: p.get("user_id") for p in (participants_resp.data or [])}

        user_ids = list({uid for uid in participant_map.values() if uid})

        users_resp = (
            supabase.table("users")
            .select("id, first_name, last_name")
            .in_("id", user_ids)
            .execute()
        )

        user_map = {}
        for u in users_resp.data or []:
            full_name = " ".join(
                [
                    part
                    for part in [u.get("first_name"), u.get("last_name")] if part
                ]
            )
            user_map[u["id"]] = full_name or None

        for r in reviews:
            pid = r.get("participant_id")
            uid = participant_map.get(pid)
            r["reviewer_name"] = user_map.get(uid)

        return jsonify({"success": True, "reviews": reviews}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


def _get_authenticated_participant_id():
    """Resolve participant_id from Authorization header.

    Returns (participant_id, error_response_or_None).
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return None, (jsonify({"success": False, "error": "Missing token"}), 401)

    token = auth_header.split(" ")[1]
    valid, payload = verify_token(token)
    if not valid:
        return None, (jsonify({"success": False, "error": "Invalid token"}), 401)

    auth_id = payload.get("sub")
    if not auth_id:
        return None, (
            jsonify({"success": False, "error": "Token missing user ID"}), 401
        )

    user_resp = (
        supabase.table("users")
        .select("id")
        .eq("auth_id", auth_id)
        .maybe_single()
        .execute()
    )

    if not user_resp or not user_resp.data:
        return None, (jsonify({"success": False, "error": "User not found"}), 404)

    user_id = user_resp.data["id"]

    participant_resp = (
        supabase.table("participants")
        .select("id")
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )

    if not participant_resp or not participant_resp.data:
        return None, (
            jsonify({"success": False, "error": "Participant not found"}), 403
        )

    return participant_resp.data["id"], None


def _has_participant_purchased_product(participant_id: int, product_id: int) -> bool:
    """Check via orders/products_orders whether participant purchased product."""
    orders_resp = (
        supabase.table("orders")
        .select("id")
        .eq("participant_id", participant_id)
        .execute()
    )

    orders = orders_resp.data or []
    if not orders:
        return False

    order_ids = [o["id"] for o in orders]

    po_resp = (
        supabase.table("products_orders")
        .select("id")
        .eq("product_id", product_id)
        .in_("order_id", order_ids)
        .execute()
    )

    return bool(po_resp.data)


@product_bp.route("/products/<int:product_id>/reviews/eligibility", methods=["GET"])
def review_eligibility(product_id: int):
    """Return whether current participant can review this product."""
    participant_id, error = _get_authenticated_participant_id()
    if error is not None:
        return error

    try:
        purchased = _has_participant_purchased_product(participant_id, product_id)

        existing_review_resp = (
            supabase.table("product_reviews")
            .select("id")
            .eq("participant_id", participant_id)
            .eq("product_id", product_id)
            .maybe_single()
            .execute()
        )

        already_reviewed = bool(existing_review_resp and existing_review_resp.data)

        can_review = purchased and not already_reviewed

        return (
            jsonify(
                {
                    "success": True,
                    "purchased": purchased,
                    "already_reviewed": already_reviewed,
                    "can_review": can_review,
                }
            ),
            200,
        )
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@product_bp.route("/products/<int:product_id>/reviews", methods=["POST"])
def create_product_review(product_id: int):
    """Create a review for a product.

    Only allowed if the authenticated participant has purchased the product.
    """
    participant_id, error = _get_authenticated_participant_id()
    if error is not None:
        return error

    if not _has_participant_purchased_product(participant_id, product_id):
        return (
            jsonify(
                {
                    "success": False,
                    "error": "You are not allowed to review this product.",
                }
            ),
            403,
        )

    data = request.get_json(silent=True) or {}
    rating = data.get("rating")
    text = data.get("text")

    try:
        rating_int = int(rating)
    except (TypeError, ValueError):
        return jsonify({"success": False, "error": "Invalid rating"}), 400

    if rating_int < 1 or rating_int > 5:
        return jsonify({"success": False, "error": "Rating must be 1-5"}), 400

    try:
        # Ensure one review per participant per product
        existing_review_resp = (
            supabase.table("product_reviews")
            .select("id")
            .eq("participant_id", participant_id)
            .eq("product_id", product_id)
            .maybe_single()
            .execute()
        )

        if existing_review_resp and existing_review_resp.data:
            return (
                jsonify(
                    {
                        "success": False,
                        "error": "You have already reviewed this product.",
                    }
                ),
                400,
            )

        now = datetime.now(timezone.utc).isoformat()

        insert_resp = (
            supabase.table("product_reviews")
            .insert(
                {
                    "participant_id": participant_id,
                    "product_id": product_id,
                    "rating": rating_int,
                    "text": text,
                    "created_at": now,
                }
            )
            .execute()
        )

        review = (insert_resp.data or [None])[0]

        return jsonify({"success": True, "review": review}), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@product_bp.route("/add-product", methods=["POST"])
def add_product():
    # 1. Autorizacija (Tvoj postojeći kod)
    auth_header = request.headers.get("Authorization")
    if not auth_header or not auth_header.startswith("Bearer "):
        return jsonify({"error": "Nedostaje token"}), 401

    token = auth_header.split(" ")[1]
    is_valid, result = verify_token(token)
    if not is_valid:
        return jsonify(result), 401

    user_payload = result

    try:
        data = request.get_json()
        user_auth_id = user_payload.get("sub")
        
        # 2. Pronalaženje Organizatora (Tvoj postojeći kod)
        user_resp = supabase.table("users").select("id").eq("auth_id", user_auth_id).execute()
        if not user_resp.data:
            return jsonify({"error": "Korisnik nije pronađen"}), 404
        
        internal_user_id = user_resp.data[0].get("id")
        org_resp = supabase.table("organizers").select("id, profile_name").eq("user_id", internal_user_id).execute()
        
        if not org_resp.data:
            return jsonify({"error": "Profil organizatora nije pronađen"}), 404
            
        organizer_id = org_resp.data[0].get("id")
        organizer_name = org_resp.data[0].get("profile_name") or "Nepoznati umjetnik"

        # 3. Priprema podataka
        name = data.get("name")
        image_url = data.get("image_url") # URL koji je front već poslao u Supabase
        
        # --- KORAK A: Upis u tablicu 'photos' ---
        photo_id = None
        if image_url:
            photo_resp = supabase.table("photos").insert({
                "url": image_url,
                "description": f"Slika za proizvod: {name}"
            }).execute()
            
            if not photo_resp.data:
                return jsonify({"error": "Greška pri spremanju slike u tablicu photos"}), 500
            
            # Uzimamo generirani ID iz tablice photos
            photo_id = photo_resp.data[0].get("id")

        # --- KORAK B: Upis u tablicu 'products' s photo_id-om ---
        product_resp = supabase.table("products").insert({
            "name": name,
            "description": data.get("description", ""),
            "price": float(data.get("price")),
            "quantity_left": int(data.get("quantity_left")),
            "category": data.get("category", "").lower(),
            "seller_id": organizer_id,
            "photo_id": photo_id, # Poveznica na tablicu photos
            "sold_at_least_once": False,
        }).execute()

        if not product_resp.data:
            return jsonify({"error": "Greška pri upisu proizvoda"}), 500

        # 4. Notifikacija (Tvoj postojeći kod)
        supabase.table("notifications").insert({
            "title": f"Organizator {organizer_name} je dodao novi artikl",
            "subtitle": f"Novi rad: {name}",
            "body": data.get("description", "")[:100],
            "type": "product",
            "subject": f"Kategorija: {data.get('category', '').capitalize()}",
            "created_at": datetime.now(timezone.utc).isoformat()
        }).execute()

        return jsonify({
            "success": True, 
            "message": "Proizvod i slika uspješno povezani",
            "product": product_resp.data[0]
        }), 201

    except Exception as e:
        print(f"Server Error: {str(e)}")
        return jsonify({"error": str(e)}), 500