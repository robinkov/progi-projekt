# Pokretanje ClayPlay aplikacije

## Backend

Treba imati instaliran **Python** s verzijom **3.8** ili novijom te Pythonov package manager `pip`

Napraviti `.env` datoteku u mapi `/backend` sa sljedećim ključevima:

```python
DATABASE_URL = postgresql://postgres.sioqgofegshqcrmwbqtd:$$Progi1231@aws-1-eu-west-1.pooler.supabase.com:5432/postgres
SUPABASE_ANON_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3Fnb2ZlZ3NocWNybXdicXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTkxNzksImV4cCI6MjA3NzMzNTE3OX0.Yzwssz1RUS93uwIUtpFJgc1GJHCCLp_dHV0Z5NxzMAo
SUPABASE_SERVICE_KEY = eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3Fnb2ZlZ3NocWNybXdicXRkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc1OTE3OSwiZXhwIjoyMDc3MzM1MTc5fQ.CHdcvo0mOz2mx4mHEbixbUitBEMdRLQph-jDsfKNRy8
SUPABASE_URL = https://sioqgofegshqcrmwbqtd.supabase.co
SECRET_KEY = $$Progi1231
GOOGLE_REDIRECT_URL = http://localhost:5000/auth/google/callback
GITHUB_REDIRECT_URL = http://localhost:5000/auth/github/callback
SUPABASE_VERIFY_URL = https://sioqgofegshqcrmwbqtd.supabase.co/auth/v1/callback
SUPABASE_JWT_SECRET = n8SwyxBbDmfduWrYFJRQ0ct/f30UM1I/x8lJ9vIwLEYqGUuWHFeSzDnR0b+bnu1yCz5T1YY2T5plOqyg7XvRtQ==
PAYPAL_CLIENT_ID = ARXyr_WfSF1KmFDFtp6FUNOJvCXnalaf9yBXHyouQFozXdmUHolBhU0iTIyf_N565XP08BX8G58aSOwF
PAYPAL_SECRET = EHfUI-XYyr7avXxKtlXJONU___S_dCwmv1ezJZx6djHONJlZjD9bOWhDlMu1pbnSPHKc3KcUHe-U1krQ
```

Za početak treba osigurati da su instalirani svi moduli:

```bash
cd backend
```
```bash
pip install -r requirements.txt
```

Ako su svi moduli uspješno instalirani onda se pokreće sami backend:

```bash
python run.py
```

## Frontend

Nakon što je backend pokrenut, otvoriti novi shell i ovoga puta navigirati se u `frontend/` mapu:

```bash
cd frontend
```

Isto treba napraviti `.env` datoteku sa sljedećim ključevima:

```bash
VITE_APP_URL=http://localhost:5173
VITE_BACKEND_URL=http://localhost:9000
VITE_SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpb3Fnb2ZlZ3NocWNybXdicXRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE3NTkxNzksImV4cCI6MjA3NzMzNTE3OX0.Yzwssz1RUS93uwIUtpFJgc1GJHCCLp_dHV0Z5NxzMAo
```

Treba pripaziti da je na računalo instaliran `npm` package manager i zatim instalirati sve module:

```bash
npm install
```

Ako su svi moduli uspješno instalirani, može se pokrenuti frontend:

```bash
npm run dev
```

Aplikaciji se zatim pristupa upisivanjem `localhost:5173` u internetski preglednik.
