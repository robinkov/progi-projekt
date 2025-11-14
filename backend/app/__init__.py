from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv() 

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")

    CORS(app)

    from .routes.auth import user_bp

    from .routes.profileManagement import profile_bp

    app.register_blueprint(profile_bp)

    app.register_blueprint(user_bp, url_prefix="/api")

    return app

