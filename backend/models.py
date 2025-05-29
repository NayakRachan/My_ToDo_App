#this is the actual logic for the database(SQLite)
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Todo(db.Model):  #creating 3 columns here
    id = db.Column(db.Integer, primary_key=True)
    task = db.Column(db.String(200), nullable=False)
    completed = db.Column(db.Boolean, default=False)
