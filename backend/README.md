
---

## Rute AUTH

### 🔹 1. `GET /api/profile`

**Opis:**  
Verificira JWT token

**Glava zahtjeva (JSON):**
```json
{
  "Authorization" : "<jwt_token>"
}
```

**Tijelo odgovora (JSON):**
```json
{
  "validToken": "True/False"
}
```

