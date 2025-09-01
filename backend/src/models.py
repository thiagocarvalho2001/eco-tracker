from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(80), nullable=False)
    age = db.Column(db.Integer)
    neighborhood = db.Column(db.String(120))
    city = db.Column(db.String(120))
    points = db.Column(db.Integer, default=0)

    def __repr__(self):
        return f'<User {self.name}>'

class Discard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    material_type = db.Column(db.String(80), nullable=False)
    quantity = db.Column(db.String(80))
    location_manual = db.Column(db.String(200))
    location_gps_lat = db.Column(db.Float)
    location_gps_lon = db.Column(db.Float)
    timestamp = db.Column(db.DateTime, default=db.func.current_timestamp())

    def __repr__(self):
        return f'<Discard {self.material_type} by User {self.user_id}>'

