from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from models import db, User, Discard
import os

app = Flask(__name__, static_folder='../static')
CORS(app)  # Enable CORS for all routes
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///recycling.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
db.init_app(app)

with app.app_context():
    db.create_all()

@app.route("/")
def serve_frontend():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/<path:path>")
def serve_static_files(path):
    if os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    new_user = User(
        name=data["name"],
        age=data.get("age"),
        neighborhood=data.get("neighborhood"),
        city=data.get("city"),
    )
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User created successfully", "user_id": new_user.id}), 201

@app.route("/discards", methods=["POST"])
def register_discard():
    data = request.get_json()
    new_discard = Discard(
        user_id=data["user_id"],
        material_type=data["material_type"],
        quantity=data.get("quantity"),
        location_manual=data.get("location_manual"),
        location_gps_lat=data.get("location_gps_lat"),
        location_gps_lon=data.get("location_gps_lon"),
    )
    db.session.add(new_discard)
    db.session.commit()
    # Gamification: add points to user
    user = User.query.get(data["user_id"])
    if user:
        user.points += 10  # Example: 10 points per discard
        db.session.commit()
    return jsonify({"message": "Discard registered successfully", "discard_id": new_discard.id}), 201

@app.route("/users/<int:user_id>/discards", methods=["GET"])
def get_user_discards(user_id):
    discards = Discard.query.filter_by(user_id=user_id).all()
    result = []
    for discard in discards:
        result.append({
            "id": discard.id,
            "material_type": discard.material_type,
            "quantity": discard.quantity,
            "location_manual": discard.location_manual,
            "location_gps_lat": discard.location_gps_lat,
            "location_gps_lon": discard.location_gps_lon,
            "timestamp": discard.timestamp.isoformat()
        })
    return jsonify(result), 200

@app.route("/community_discards", methods=["GET"])
def get_community_discards():
    discards = Discard.query.all()
    result = []
    for discard in discards:
        result.append({
            "id": discard.id,
            "user_id": discard.user_id,
            "material_type": discard.material_type,
            "quantity": discard.quantity,
            "location_manual": discard.location_manual,
            "location_gps_lat": discard.location_gps_lat,
            "location_gps_lon": discard.location_gps_lon,
            "timestamp": discard.timestamp.isoformat()
        })
    return jsonify(result), 200

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = User.query.get(user_id)
    if user:
        return jsonify({
            "id": user.id,
            "name": user.name,
            "age": user.age,
            "neighborhood": user.neighborhood,
            "city": user.city,
            "points": user.points
        }), 200
    return jsonify({"message": "User not found"}), 404

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)


