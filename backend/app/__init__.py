from flask import Flask
import os
from dotenv import load_dotenv

load_dotenv()


def create_app():
    app = Flask(__name__)

    
    app.config.from_object("config.Config")

    app.config['SECRET_KEY'] = os.environ.get("SECRET_KEY")
    
    from .routes.auth import user_bp
    app.register_blueprint(user_bp)
    
    return app