from flask import Blueprint, jsonify, request
from .. import db
from ..models import User

user = Blueprint("user", __name__)

#ovo je samo proba da vidimo jeli funkcionira
@user.route("/user/register", methods=["POST"])
def proba():
    return jsonify({"message": "nesto"})

@user.route("/user/login", methods=["POST"])
def test_user():
    user = User(id = 2,first_name="Lovre", last_name="Smith", username="alice123")
    db.session.add(user)
    db.session.commit()
    return {"message": "User inserted!", "id": user.id}