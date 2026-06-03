import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Plus,
  ArrowLeft,
  Trash2,
  ChevronDown,
  Calendar,
  Tag,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  ClipboardList,
} from "lucide-react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "",
    dueDate: "",
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/Tasks");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post("/Tasks", newTask);
      setNewTask({
        title: "",
        description: "",
        priority: "Medium",
        category: "",
        dueDate: "",
      });
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
    setIsSubmitting(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/Tasks/${id}`);
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await API.put(`/Tasks/${task.id}`, { ...task, status: newStatus });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityStyle = (p) => {
    if (p === "High") return "bg-red-50 text-red-700 border-red-200";
    if (p === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getStatusDot = (s) => {
    if (s === "Completed") return "bg-emerald-500";
    if (s === "InProgress") return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <ClipboardList className="w-7 h-7 text-indigo-600" />
              My Tasks
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Manage and track your daily tasks
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium text-sm transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm shadow-lg shadow-indigo-200 transition-all active:scale-95"
            >
              {showForm ? (
                <X className="w-4 h-4" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              {showForm ? "Close" : "New Task"}
            </button>
          </div>
        </div>

        {/* Create Form */}
        {showForm && (
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200 shadow-lg mb-8 animate-in slide-in-from-top-4 duration-300">
            <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2">
              <Plus className="w-5 h-5 text-indigo-600" />
              Create New Task
            </h3>
            <form onSubmit={handleAddTask} className="space-y-4">
              <input
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) =>
                  setNewTask({ ...newTask, title: e.target.value })
                }
                required
              />
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-none"
                placeholder="Description"
                value={newTask.description}
                onChange={(e) =>
                  setNewTask({ ...newTask, description: e.target.value })
                }
                rows={3}
              />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  placeholder="Category"
                  value={newTask.category}
                  onChange={(e) =>
                    setNewTask({ ...newTask, category: e.target.value })
                  }
                />
                <div className="relative">
                  <select
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm appearance-none bg-white"
                    value={newTask.priority}
                    onChange={(e) =>
                      setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3.5 pointer-events-none" />
                </div>
                <input
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) =>
                    setNewTask({ ...newTask, dueDate: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm shadow-md transition-all active:scale-95 disabled:opacity-50"
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </button>
            </form>
          </div>
        )}

        {/* Tasks Grid */}
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 font-medium mb-4">No tasks yet!</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
            >
              + Create Your First Task
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${getStatusDot(task.status)}`}
                    />
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      {task.title}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                  {task.description || "No description"}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                  <span className="flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5" />
                    {task.category || "Uncategorized"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No date"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityStyle(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                    <div className="relative">
                      <select
                        className="appearance-none bg-transparent pr-5 pl-2 py-1 rounded-lg text-xs font-semibold text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
                        value={task.status}
                        onChange={(e) =>
                          handleStatusChange(task, e.target.value)
                        }
                      >
                        <option>Pending</option>
                        <option>InProgress</option>
                        <option>Completed</option>
                      </select>
                      <ChevronDown className="w-3 h-3 text-gray-400 absolute right-0 top-1.5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskList;
