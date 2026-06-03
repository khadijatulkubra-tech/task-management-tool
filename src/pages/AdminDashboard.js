import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  Users,
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  Edit2,
  X,
  Filter,
  ChevronDown,
  LogOut,
  Crown,
  Search,
} from "lucide-react";

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [editTask, setEditTask] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");
  const [isEditLoading, setIsEditLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        API.get("/Tasks"),
        API.get("/Users"),
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/admin";
  };

  const handleStatusUpdate = async (task, newStatus) => {
    try {
      await API.put(`/Tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
        category: task.category,
        dueDate: task.dueDate,
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async () => {
    setIsEditLoading(true);
    try {
      await API.put(`/Tasks/${editTask.id}`, {
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        status: editTask.status,
        category: editTask.category,
        dueDate: editTask.dueDate,
      });
      setEditTask(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
    setIsEditLoading(false);
  };

  const uniqueUserNames = ["All", ...new Set(tasks.map((t) => t.assignedTo))];
  const filteredTasks = tasks.filter((t) => {
    const userMatch = filterUser === "All" || t.assignedTo === filterUser;
    const statusMatch = filterStatus === "All" || t.status === filterStatus;
    return userMatch && statusMatch;
  });

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((t) => t.status === "Pending").length;
  const inProgressTasks = tasks.filter((t) => t.status === "InProgress").length;
  const completedTasks = tasks.filter((t) => t.status === "Completed").length;
  const totalUsers = users.filter((u) => u.role !== "Admin").length;

  const stats = [
    {
      label: "Total Users",
      value: totalUsers,
      icon: Users,
      gradient: "from-violet-500 to-purple-600",
      lightBg: "bg-violet-50",
      textColor: "text-violet-600",
    },
    {
      label: "Total Tasks",
      value: totalTasks,
      icon: ClipboardList,
      gradient: "from-blue-500 to-indigo-600",
      lightBg: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "In Progress",
      value: inProgressTasks,
      icon: Clock,
      gradient: "from-amber-400 to-orange-500",
      lightBg: "bg-amber-50",
      textColor: "text-amber-600",
    },
    {
      label: "Completed",
      value: completedTasks,
      icon: CheckCircle2,
      gradient: "from-emerald-400 to-green-500",
      lightBg: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Pending",
      value: pendingTasks,
      icon: AlertCircle,
      gradient: "from-red-400 to-rose-500",
      lightBg: "bg-red-50",
      textColor: "text-red-600",
    },
  ];

  const getPriorityColor = (p) => {
    if (p === "High") return "bg-red-100 text-red-700 border-red-200";
    if (p === "Medium") return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-emerald-100 text-emerald-700 border-emerald-200";
  };

  const getStatusColor = (s) => {
    if (s === "Completed")
      return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (s === "InProgress") return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Crown className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900 leading-tight">
                Admin Dashboard
              </h1>
              <p className="text-xs text-gray-500">
                Welcome back, {user.fullName}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 font-medium text-sm transition-all active:scale-95 border border-red-200"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.lightBg} flex items-center justify-center ${stat.textColor} group-hover:scale-110 transition-transform`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <span className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </span>
              </div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <div
                className={`mt-3 h-1.5 rounded-full bg-gradient-to-r ${stat.gradient} opacity-20`}
              />
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-gray-100/80 p-1.5 rounded-xl w-fit">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "tasks"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            All Tasks
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "users"
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <Users className="w-4 h-4" />
            All Users
          </button>
        </div>

        {/* Edit Modal */}
        {editTask && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-indigo-600" />
                  Edit Task
                </h3>
                <button
                  onClick={() => setEditTask(null)}
                  className="w-8 h-8 rounded-lg hover:bg-gray-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Title
                  </label>
                  <input
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                    value={editTask.title}
                    onChange={(e) =>
                      setEditTask({ ...editTask, title: e.target.value })
                    }
                    placeholder="Task title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Description
                  </label>
                  <textarea
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm resize-none"
                    value={editTask.description}
                    onChange={(e) =>
                      setEditTask({ ...editTask, description: e.target.value })
                    }
                    placeholder="Description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Category
                    </label>
                    <input
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                      value={editTask.category}
                      onChange={(e) =>
                        setEditTask({ ...editTask, category: e.target.value })
                      }
                      placeholder="Category"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Due Date
                    </label>
                    <input
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm"
                      type="date"
                      value={
                        editTask.dueDate ? editTask.dueDate.split("T")[0] : ""
                      }
                      onChange={(e) =>
                        setEditTask({ ...editTask, dueDate: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Priority
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm appearance-none bg-white"
                        value={editTask.priority}
                        onChange={(e) =>
                          setEditTask({ ...editTask, priority: e.target.value })
                        }
                      >
                        <option>Low</option>
                        <option>Medium</option>
                        <option>High</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Status
                    </label>
                    <div className="relative">
                      <select
                        className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all text-sm appearance-none bg-white"
                        value={editTask.status}
                        onChange={(e) =>
                          setEditTask({ ...editTask, status: e.target.value })
                        }
                      >
                        <option>Pending</option>
                        <option>InProgress</option>
                        <option>Completed</option>
                      </select>
                      <ChevronDown className="w-4 h-4 text-gray-400 absolute right-3 top-3 pointer-events-none" />
                    </div>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleEditSave}
                    disabled={isEditLoading}
                    className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-sm transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {isEditLoading ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    onClick={() => setEditTask(null)}
                    className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-all active:scale-[0.98]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tasks Tab */}
        {activeTab === "tasks" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-indigo-600" />
                All Tasks
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                  {filteredTasks.length}
                </span>
              </h2>
              <div className="flex gap-3">
                <div className="relative">
                  <Filter className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <select
                    className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none bg-white"
                    value={filterUser}
                    onChange={(e) => setFilterUser(e.target.value)}
                  >
                    {uniqueUserNames.map((u) => (
                      <option key={u} value={u}>
                        {u === "All" ? "All Users" : u}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                  <select
                    className="pl-9 pr-8 py-2 rounded-xl border border-gray-200 text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none appearance-none bg-white"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option>Pending</option>
                    <option>InProgress</option>
                    <option>Completed</option>
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {loading ? (
              <div className="p-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : filteredTasks.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium">
                  No tasks found matching your filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Assigned
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTasks.map((task, index) => (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                          {index + 1}
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-sm font-semibold text-gray-900">
                            {task.title}
                          </p>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {task.assignedTo}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getPriorityColor(task.priority)}`}
                          >
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="relative">
                            <select
                              className={`appearance-none bg-transparent pr-6 pl-2 py-1 rounded-lg text-xs font-bold cursor-pointer hover:bg-gray-100 transition-colors ${getStatusColor(task.status)}`}
                              value={task.status}
                              onChange={(e) =>
                                handleStatusUpdate(task, e.target.value)
                              }
                            >
                              <option>Pending</option>
                              <option>InProgress</option>
                              <option>Completed</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-gray-400 absolute right-1 top-1.5 pointer-events-none" />
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {task.category || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {task.dueDate
                            ? new Date(task.dueDate).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                },
                              )
                            : "—"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setEditTask(task)}
                            className="p-2 rounded-lg hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-600" />
                All Users
                <span className="px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600 text-xs font-bold">
                  {totalUsers}
                </span>
              </h2>
            </div>

            {loading ? (
              <div className="p-12 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50/80 border-b border-gray-100">
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        #
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Tasks
                      </th>
                      <th className="text-left px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users
                      .filter((u) => u.role !== "Admin")
                      .map((u, index) => (
                        <tr
                          key={u.id}
                          className="hover:bg-gray-50/50 transition-colors"
                        >
                          <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
                                {u.fullName?.charAt(0).toUpperCase()}
                              </div>
                              <span className="text-sm font-semibold text-gray-900">
                                {u.fullName}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {u.email}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                              {u.taskCount || 0} Tasks
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {new Date(u.createdAt).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminDashboard;
