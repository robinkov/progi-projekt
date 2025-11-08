from supabase import create_client
import os

from dotenv import load_dotenv
load_dotenv()

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_ANON_KEY = os.environ.get("SUPABASE_ANON_KEY")
SUPABASE_SERVICE_KEY = os.environ.get("SUPABASE_SERVICE_KEY")

# client for normal anon/public operations
supabase = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)

# client for server-side operations like exchange_code_for_session
supabase_service = create_client(SUPABASE_URL, SUPABASE_SERVICE_KEY)