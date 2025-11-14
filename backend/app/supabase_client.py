import os
from supabase.client import Client

SUPABASE_URL = os.environ.get("SUPABASE_URL", "")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY", "")

# Admin client (service key)
admin_supabase = Client(SUPABASE_URL, SUPABASE_SERVICE_KEY)

# Regular client (anon key)
from flask import g
from werkzeug.local import LocalProxy
from supabase.client import ClientOptions
from .flask_storage import FlaskSessionStorage

SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY", "")

def get_supabase() -> Client:
    if "supabase" not in g:
        g.supabase = Client(
            SUPABASE_URL,
            SUPABASE_ANON_KEY,
            options=ClientOptions(
                storage=FlaskSessionStorage(),
                flow_type="pkce"
            ),
        )
    return g.supabase

supabase: Client = LocalProxy(get_supabase)
