from flask import Blueprint, request, jsonify, redirect
from ..supabase_client import supabase
from dotenv import load_dotenv

load_dotenv()
user_bp = Blueprint("user", __name__)

@user_bp.route("/register", methods=["POST"])
def register():
    data = request.json
    first_name = data.get("first_name")
    last_name = data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    role = data.get("role")

    if not email or not password:
        return jsonify({"message": "Email and password are required", "valid" : False}), 400
    
    if not role:
        return jsonify({"message": "Role is required", "valid": False}), 400
    
    if not first_name or not last_name:
        return jsonify({"message": "First name and last name are required", "valid": False}), 400

    try:

        existing = supabase.table("users").select("*").eq("mail", email).execute()
        if existing.data:
            return jsonify({"message": "User already exists with this email", "valid" : False}), 400
        
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        supabase.table("users").insert({
            "mail": email,
            "first_name" : first_name,
            "last_name" : last_name
        }).execute()

        user_response = supabase.from_("users").select("*").eq("mail", email).single().execute()
        user_id = user_response.data["id"]

        if role in ["organizer", "participant"]:
            if role == "organizer":
                supabase.table("organizers").insert({
                    "user_id": user_id,
                    "profile_name": f"{first_name} {last_name}",
                    "approved_by_admin": False
                }).execute()
            
            else:
                supabase.table("participants").insert({
                    "user_id": user_id
                }).execute()

        else:
            return jsonify({"message": "Role is not valid", "valid": False})

        return jsonify({
            "message": "User registered",
            "data": {
                "first_name": first_name,
                "last_name": last_name,
                "mail": email,
                "access_token": auth_response.session.access_token
            },
            "valid" : True
        }), 201

    except Exception as e:
        return jsonify({"message": "Failed to register user", "valid" : False}), 400

@user_bp.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email and password are required", "valid" : False}), 400

    try:
        
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })

        if auth_response.session is None:
            return jsonify({"message": "Invalid credentials", "valid" : False}), 401

        
        user_data = supabase.table("users").select("first_name, last_name, mail").eq("mail", email).single().execute()
        user = user_data.data
        user_id = user["id"]

        organizer_check = supabase.table("organizers").select("id").eq("user_id", user_id).execute()
        participant_check = supabase.table("participants").select("id").eq("user_id", user_id).execute()

        if organizer_check.data:
            role = "organizer"
            role_data = supabase.table("organizers").select("membership_plan_id, membership_expiry_date, profile_name, logo_photo_id, banner_photo_id, description, approved_by_admin").eq("user_id", user_id).execute()
        elif participant_check.data:
            role = "participant"


        return jsonify({
            "message": "Logged in successfully",
            "user": user_data.data,
            "access_token": auth_response.session.access_token,
            "role": role,
            "role_data": role_data if role_data else "",
            "valid" : True
        }), 200

    except Exception as e:
        return jsonify({"message": str(e), "valid" : False}), 400


@user_bp.route("/logout", methods=["POST"])
def logout():
    data = request.json
    access_token = data.get("access_token")

    if not access_token:
        return jsonify({"message": "Refresh token is required", "valid" : False}), 400

    try:

        supabase.auth.admin.sign_out(access_token)


        return jsonify({"message": "Logged out successfully", "valid" : True}), 200
    except Exception as e:
        return jsonify({"message": str(e), "valid" : False}), 400
    



@user_bp.route("/login/google")
def google_login():
    try:
        
        redirect_url = request.host_url.rstrip("/") + ("/auth/google/callback")
        
        url = supabase.auth.sign_in_with_oauth({
            "provider": "google",
            "options": {
                "redirect_to": redirect_url
            }
        })
        return redirect(url.url)
    except Exception as e:
        return jsonify({"message": str(e), "valid": False}), 400




@user_bp.route("/auth/google/callback")
def google_callback():
    code = request.args.get("code")
    role = request.args.get("role")
    if not code:
        return jsonify({"message": "Missing authorization code", "valid": False}), 400

    try:
        
        params = {
            "auth_code": code,
        }

        session_response = supabase.auth.exchange_code_for_session(params)
        if not session_response.session:
            return jsonify({"message": "Failed to exchange code", "valid": False}), 400


        user = session_response.user

        user_dict = {
            "email": user.email,
            "role": user.role,
        }

        
        existing = supabase.table("users").select("*").eq("mail", user.email).execute()
        if not existing.data:
            
            supabase.table("users").insert({
                "mail": user.email,
                "first_name": user.user_metadata.get("full_name", "").split(" ")[0] if user.user_metadata else "",
                "last_name": " ".join(user.user_metadata.get("full_name", "").split(" ")[1:]) if user.user_metadata else ""
            }).execute()


            user_response = supabase.from_("users").select("*").eq("mail", user.email).single().execute()
            user_id = user_response.data["id"]


            if role == "organizer":
                supabase.table("organizers").insert({
                    "user_id": user_id,
                    "profile_name": f"{user_response.data['first_name']} {user_response.data['last_name']}",
                    "approved_by_admin": False
                }).execute()
                role_data = supabase.table("organizers").select("membership_plan_id, membership_expiry_date, profile_name, logo_photo_id, banner_photo_id, description, approved_by_admin").eq("user_id", user_id).execute()
            else:
                supabase.table("participants").insert({
                    "user_id": user_id
                }).execute()



        return jsonify({
            "access_token": session_response.session.access_token,
            "message": "Google login successful",
            "user": user_dict,
            "valid": True
        })

    except Exception as e:
        return jsonify({"message": str(e), "valid": False})



@user_bp.route("/login/github")
def login_github():
    
    try:
        redirect_url = request.host_url.rstrip("/") + "/auth/github/callback"

        url = supabase.auth.sign_in_with_oauth({
            "provider": "github",
            "options": {"redirect_to": redirect_url}
        })

        return redirect(url.url)

    except Exception as e:
        return jsonify({"message": str(e), "valid": False}), 400


@user_bp.route("/auth/github/callback")
def github_callback():
    code = request.args.get("code")
    role = request.args.get("role")

    if not code:
        return jsonify({"message": "Missing authorization code", "valid": False}), 400

    try:
        session_response = supabase.auth.exchange_code_for_session({"auth_code": code})

        if not session_response.session:
            return jsonify({"message": "Failed to exchange authorization code", "valid": False}), 400

        user = session_response.user
        email = user.email

        existing_user = supabase.table("users").select("*").eq("mail", email).execute()

        if not existing_user.data:

            if not role:
                return jsonify({
                    "message": "Account not found. Please register first and choose a role.",
                    "valid": False
                }), 400

            
            name = user.user_metadata.get("user_name", "")
            first_name = name.split(" ")[0] if name else ""
            last_name = " ".join(name.split(" ")[1:]) if len(name.split(" ")) > 1 else ""

            supabase.table("users").insert({
                "mail": email,
                "first_name": first_name,
                "last_name": last_name
            }).execute()

            user_response = supabase.table("users").select("*").eq("mail", email).single().execute()
            user_id = user_response.data["id"]

           
            if role == "organizer":
                supabase.table("organizers").insert({
                    "user_id": user_id,
                    "profile_name": f"{first_name} {last_name}",
                    "approved_by_admin": False
                }).execute()

                role_data = supabase.table("organizers").select(
                    "membership_plan_id, membership_expiry_date, profile_name, logo_photo_id, banner_photo_id, description, approved_by_admin"
                ).eq("user_id", user_id).execute()
            else:
                supabase.table("participants").insert({"user_id": user_id}).execute()
                role_data = None
        else:
            
            user_id = existing_user.data[0]["id"]
            role_data = None

        
        return jsonify({
            "message": "GitHub login successful",
            "access_token": session_response.session.access_token,
            "user": {
                "email": email,
            },
            "valid": True
        }), 200

    except Exception as e:
        return jsonify({"message": str(e), "valid": False}), 400
