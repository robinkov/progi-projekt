from flask import Blueprint, jsonify

main = Blueprint("main", __name__)

#ovo je samo proba da vidimo jeli funkcionira
@main.route("/api/nes", methods=["GET"])
def proba():
    return jsonify({"message": "nesto"})