# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from models import db, Todo

app = Flask(__name__)
CORS(app)

# SQLite DB config
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///todos.db"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

with app.app_context():
    db.create_all()

# Routes
@app.route("/api/todos", methods=["GET"])
def get_todos():
    todos = Todo.query.all()
    return jsonify([{"id": t.id, "task": t.task, "completed": t.completed} for t in todos])

@app.route("/api/todos", methods=["POST"])
def add_todo():
    data = request.get_json()
    new_todo = Todo(task=data["task"])
    db.session.add(new_todo)
    db.session.commit()
    return jsonify({"id": new_todo.id, "task": new_todo.task, "completed": new_todo.completed}), 201

@app.route("/api/todos/<int:todo_id>", methods=["PUT"])
def update_todo(todo_id):
    data = request.get_json()
    todo = Todo.query.get(todo_id)
    if todo is None:
        return jsonify({"error": "Todo not found"}), 404

    todo.task = data.get("task", todo.task)
    todo.completed = data.get("completed", todo.completed)

    db.session.commit()
    return jsonify({"id": todo.id, "task": todo.task, "completed": todo.completed})

@app.route("/api/todos/<int:todo_id>", methods=["DELETE"])
def delete_todo(todo_id):
    todo = Todo.query.get(todo_id)
    if todo is None:
        return jsonify({"error": "Todo not found"}), 404

    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Todo deleted"}), 200


if __name__ == "__main__":
    app.run(debug=True)
