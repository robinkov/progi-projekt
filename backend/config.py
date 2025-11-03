import os
from dotenv import load_dotenv


load_dotenv()

class Config:
    DEBUG = True
    SECRET_KEY = os.environ.get("SUPABASE_KEY")

    SQLALCHEMY_DATABASE_URI = os.environ.get("SUPABASE_URL")
    SQLALCHEMY_TRACK_MODIFICATIONS = False  # Avoids warning