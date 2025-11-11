
---

## Rute AUTH

### 🔹 1. `POST /register`

**Opis:**  
Registrira novog korisnika u Supabase Auth i upisuje podatke u tablicu `users`.

**Tijelo zahtjeva (JSON):**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "password": "MySecret123"
}
```

**Tijelo odgovora (JSON):**
```json
{
  "message": "User registered",
  "user": {
    "first_name": "John",
    "last_name": "Doe",
    "mail": "john@example.com",
    "access_token": "<jwt_token>"
  },
  "valid": true
}
```

`access_token` - Vraca jwt token

`valid` - Govori nam jeli prosla registracija ako nije pise False obrnuto True


### 🔹 2. `POST /login`

**Tijelo zahtjeva (JSON):**
```json
{
  "email": "john@example.com",
  "password": "MySecret123"
}
```

**Tijelo odgovora (JSON):**
```json
{
  "message": "User registered",
  "user": {
    "first_name": "John",
    "last_name": "Doe",
    "mail": "john@example.com",
    "access_token": "<jwt_token>"
  },
  "valid": true
}
```

`access_token` - Vraca jwt token

`valid` - Govori nam jeli prosla registracija ako nije pise False obrnuto True

### 🔹 3. `POST /logout`

**Tijelo zahtjeva (JSON):**
```json
{
  "access_token": "<jwt_token>"
}

```

**Tijelo odgovora (JSON):**
```json
{
  "message": "Logged out successfully",
  "valid": true
}
```
### 4. 🔹 GET /login/google

Opis: Pokreće prijavu putem Google OAuth — preusmjerava korisnika na Google auth stranicu.
Napomena: Nema tijelo zahtjeva.
Odgovor: HTTP redirect na Google login.

### 5.🔹 GET /login/github

Opis: Pokreće prijavu putem GitHub OAuth — preusmjerava korisnika na GitHub auth stranicu.
Napomena: Nema tijelo zahtjeva.
Odgovor: HTTP redirect na GitHub login.

### 🔹 6. `GET /auth/google/callback`

**Tijelo odgovora (JSON):**
```json
{
  "message": "Google login successful",
  "user": {
    "mail": "user@gmail.com",
    "first_name": "John",
    "last_name": "Doe",
    "access_token": "<jwt_token>"
  },
  "valid": true
}
```

### 🔹 7. `GET /auth/github/callback`


**Tijelo odgovora (JSON):**
```json
{
  "message": "Github login successful",
  "user": {
    "mail": "user@github.com",
    "first_name": "John",
    "last_name": "Doe",
    "access_token": "<jwt_token>"
  },
  "valid": true
}
```
