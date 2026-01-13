from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    app.config["SECRET_KEY"] = os.environ.get("SECRET_KEY")

    CORS(app, origins=["*"], supports_credentials=True)

    from .routes.auth_routes import auth_bp

    from .routes.profileManagement import profile_bp
    from .routes.organizerProfileManagement import organizerProfile_bp
    from .routes.workshop import workshop_bp
    from .routes.exhibitions import exhibition_bp
    from .routes.product import product_bp
    from .routes.organizers import organizers_bp
    from .routes.admin import admin_bp
    from .routes.paypal import paypal_bp
    from .routes.home import home_bp
    from .routes.membership import membership_bp

    app.register_blueprint(exhibition_bp)
    app.register_blueprint(workshop_bp)
    app.register_blueprint(product_bp)
    app.register_blueprint(organizers_bp)
    app.register_blueprint(profile_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(organizerProfile_bp)
    app.register_blueprint(admin_bp)
    app.register_blueprint(paypal_bp)
    app.register_blueprint(home_bp)
    app.register_blueprint(membership_bp)
    return app
