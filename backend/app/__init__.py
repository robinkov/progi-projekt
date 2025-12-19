from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv() 

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")

    CORS(app, origins=["*"], supports_credentials=True)

    from .routes.auth_routes import auth_bp

    from .routes.profileManagement import profile_bp
    from .routes.user import user_bp
    from .routes.organizerProfileManagement import organizerProfile_bp

    app.register_blueprint(profile_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(organizerProfile_bp)

    return app

