from flask import Flask
from flask_cors import CORS
import os
from dotenv import load_dotenv

load_dotenv() 

def create_app():
    app = Flask(__name__)
    app.config.from_object("config.Config")

    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")

    CORS(app, origins="http://localhost:8081", supports_credentials=True)

    from .routes.auth import auth_bp

    from .routes.profileManagement import profile_bp
    from .routes.user import user_bp

    app.register_blueprint(profile_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(auth_bp, url_prefix="/api")

    return app

