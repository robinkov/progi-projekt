# Backend — README

Short guide to run and test the backend locally (Flask + Supabase).

## What is in this folder

- A Flask app exposing authentication and database routes.
- Entrypoint: `run.py` (starts the Flask app).

## Prerequisites

- Python 3.10+ (or compatible 3.x)
- git
- A Supabase project and API keys (URL and service/anon key)

## Required environment variables

Create a `.env` file in the `backend/` folder or set these in your environment:

- SUPABASE_URL — Supabase project URL
- SUPABASE_KEY — Supabase anon or service role key (as needed)
- FLASK_SECRET — Flask session secret (random string)

Do not commit `.env` to git.

## Quick setup (macOS / Linux)

1. Create and activate a virtual environment:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
```

2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Create a `.env` file in `backend/` (or export variables) with the values above.

4. Run the app (development):

```bash
# from the backend folder
python run.py
```

Flask listens on port 5000 by default (http://localhost:5000).

To use a different port, either pass it via environment or modify `run.py` to accept a `PORT` var.

## Testing the API

- Use `curl`, Postman, or the frontend app to call the API.
- Auth routes are implemented in `app/routes/auth.py` (`/register`, `/login`, `/logout`).

## Common issues

- 401 / Unauthorized: check `SUPABASE_KEY` and `SUPABASE_URL` values.
- Connection or CORS problems: verify the API URL and port used by the frontend (e.g. `EXPO_PUBLIC_API_URL`).
- Missing env vars: ensure `.env` exists and the virtual environment is activated.

## Helpful commands

- Deactivate the virtual environment:

```bash
deactivate
```

## Security

- Never commit `.env`, secret keys, or any credentials to git.

