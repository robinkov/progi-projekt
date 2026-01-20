import jwt
from flask import Blueprint, request, jsonify
import os
from ..supabase_client import supabase, admin_supabase
from dateutil.relativedelta import relativedelta
from datetime import datetime, timedelta, timezone


def has_membership(organizer_id):
    mt = (
        supabase.table("membership_transactions")
        .select("*")
        .eq("organizer_id", organizer_id)
        .execute()
    )
    if len(mt.data) == 0:
        return (
            False  # organizator nema nijednu transakciju, dakle nema aktivnu clanarinu
        )

    transaction_ids = list(
        {w["transaction_id"] for w in mt.data if w.get("transaction_id")}
    )
    membership_map = {
        o["transaction_id"]: o["membership_plan_id"] for o in mt.data or []
    }

    t = (
        supabase.table("transactions")
        .select("id,date_time")
        .in_("id", transaction_ids)
        .order("date_time", desc=True)
        .limit(1)
        .single()
        .execute()
    )

    transaction_id = t.data["id"]
    date_paid = t.data["date_time"]

    membership_id = membership_map.get(transaction_id)

    m = (
        supabase.table("membership_plans")
        .select("*")
        .eq("id", membership_id)
        .single()
        .execute()
    )

    duration_months = m.data["duration_months"]

    date_paid = datetime.fromisoformat(date_paid)
    expiry_date = date_paid + relativedelta(months=duration_months)

    if expiry_date < datetime.now():
        return False
    return True
