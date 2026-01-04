import os
from dotenv import load_dotenv


load_dotenv()


class Config:
    DEBUG = True
    SECRET_KEY = os.environ.get("SUPABASE_KEY")

    SUPABASE_URL = os.environ.get("SUPABASE_URL")
    SUPABASE_ANON_KEY = os.environ.get("SUPABASE_KEY")

    PAYPAL_CLIENT_ID = os.environ.get("PAYPAL_CLIENT_ID")
    PAYPAL_SECRET = os.environ.get("PAYPAL_SECRET")
