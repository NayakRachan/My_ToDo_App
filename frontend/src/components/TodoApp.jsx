import { useState, useEffect } from "react";
import axios from "axios";
import { Trash2, Plus, Check, X } from "lucide-react";

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const apiBase = "http://localhost:5000/api";

  useEffect(() => {
    setLoading(true);
    axios.get(`${apiBase}/todos`)
      .then(res => {
        setTodos(res.data);
        setError("");
      })
      .catch(err => {
        console.error("Fetch error:", err);
        setError("Failed to load todos");
      })
      .finally(() => setLoading(false));
  }, []);

  const addTodo = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await axios.post(`${apiBase}/todos`, { task: newTask });
      setTodos([...todos, res.data]);
      setNewTask("");
      setError("");
    } catch (err) {
      console.error("Add error:", err);
      setError("Failed to add todo");
    }
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;
    try {
      const res = await axios.put(`${apiBase}/todos/${id}`, {
        task: todo.task,
        completed: !todo.completed
      });
      setTodos(todos.map(t => t.id === id ? res.data : t));
      setError("");
    } catch (err) {
      console.error("Toggle error:", err);
      setError("Failed to update todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiBase}/todos/${id}`);
      setTodos(todos.filter(t => t.id !== id));
      setError("");
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete todo");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-4 px-4 sm:py-8">
      <div className="max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl mx-auto">
        {/* Main Container */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
              ✨ My Todo List
            </h1>
            <div className="text-indigo-100">
              <span className="text-lg font-semibold">{completedCount}</span>
              <span className="mx-2">of</span>
              <span className="text-lg font-semibold">{totalCount}</span>
              <span className="ml-1">completed</span>
            </div>
            {todos.length > 0 && (
              <div className="mt-4 bg-white/20 rounded-full p-1">
                <div className="bg-white/30 rounded-full h-2">
                  <div 
                    className="bg-white h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6 animate-pulse">
                <div className="flex items-center">
                  <span className="text-red-500 mr-2">⚠️</span>
                  {error}
                </div>
              </div>
            )}

            {/* Input Section */}
            <div className="mb-8">
              <div className="relative flex rounded-xl overflow-hidden shadow-lg border border-gray-200 bg-white">
                <input
                  type="text"
                  value={newTask}
                  placeholder="What's on your mind today?"
                  onChange={e => setNewTask(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-grow px-4 py-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 text-base"
                />
                <button
                  onClick={addTodo}
                  disabled={!newTask.trim()}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-4 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:from-gray-400 disabled:to-gray-400 disabled:cursor-not-allowed flex items-center justify-center min-w-[56px] active:scale-95"
                >
                  <Plus size={20} className="sm:mr-2" />
                  <span className="hidden sm:inline">Add</span>
                </button>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="text-center py-12">
                <div className="relative mx-auto w-12 h-12 mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
                </div>
                <p className="text-gray-600 text-lg">Loading your todos...</p>
              </div>
            ) : todos.length === 0 ? (
              /* Empty State */
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No todos yet!</h3>
                <p className="text-gray-500">Start by adding your first task above</p>
              </div>
            ) : (
              /* Todo List */
              <div className="space-y-3">
                {todos.map((todo, index) => (
                  <div 
                    key={todo.id} 
                    className="group bg-white rounded-xl border border-gray-200 hover:border-indigo-300 transition-all duration-200 hover:shadow-md"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center p-4">
                      {/* Toggle Button */}
                      <button
                        onClick={() => toggleTodo(todo.id)}
                        className={`mr-4 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center active:scale-95 ${
                          todo.completed 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 border-green-500 text-white shadow-lg' 
                            : 'border-gray-300 hover:border-indigo-400 hover:bg-indigo-50'
                        }`}
                      >
                        {todo.completed && <Check size={14} />}
                      </button>

                      {/* Task Text */}
                      <div className="flex-grow min-w-0">
                        <span className={`block text-base leading-relaxed transition-all duration-200 ${
                          todo.completed 
                            ? "line-through text-gray-400" 
                            : "text-gray-800"
                        }`}>
                          {todo.task}
                        </span>
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={() => deleteTodo(todo.id)}
                        className="ml-3 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 active:scale-95"
                        title="Delete todo"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        {todos.length > 0 && (
          <div className="text-center mt-6 text-gray-500 text-sm">
            <p>Keep going! You're doing great! 🌟</p>
          </div>
        )}
      </div>
    </div>
  );
}