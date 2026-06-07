import React, { useState, useEffect } from "react";
import API from "../services/api";
import {
  LayoutDashboard,
  ClipboardList,
  User,
  LogOut,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  AlertCircle,
  Clipboard,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
  });
  const [recentTasks, setRecentTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await API.get("/Tasks");
        const tasks = res.data;
        setCounts({
          total: tasks.length,
          pending: tasks.filter((t) => t.status === "Pending").length,
          inProgress: tasks.filter((t) => t.status === "InProgress").length,
          completed: tasks.filter((t) => t.status === "Completed").length,
        });
        setRecentTasks(tasks.slice(0, 5));
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchTasks();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  const completionRate =
    counts.total > 0 ? Math.round((counts.completed / counts.total) * 100) : 0;

  const stats = [
    {
      label: "Total Tasks",
      value: counts.total,
      icon: Clipboard,
      color: "text-blue-600",
      bg: "bg-blue-50",
      barBg: "bg-blue-100",
      barFill: "bg-blue-500",
      percent: 100,
    },
    {
      label: "In Progress",
      value: counts.inProgress,
      icon: Clock,
      color: "text-amber-600",
      bg: "bg-amber-50",
      barBg: "bg-amber-100",
      barFill: "bg-amber-500",
      percent: counts.total ? (counts.inProgress / counts.total) * 100 : 0,
    },
    {
      label: "Completed",
      value: counts.completed,
      icon: CheckCircle2,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      barBg: "bg-emerald-100",
      barFill: "bg-emerald-500",
      percent: counts.total ? (counts.completed / counts.total) * 100 : 0,
    },
    {
      label: "Pending",
      value: counts.pending,
      icon: AlertCircle,
      color: "text-red-600",
      bg: "bg-red-50",
      barBg: "bg-red-100",
      barFill: "bg-red-500",
      percent: counts.total ? (counts.pending / counts.total) * 100 : 0,
    },
  ];

  const getPriorityStyle = (p) => {
    if (p === "High") return "bg-red-50 text-red-700 border-red-200";
    if (p === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getStatusColor = (s) => {
    if (s === "Completed") return "bg-emerald-500";
    if (s === "InProgress") return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              <ClipboardList className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gray-900">TaskFlow</span>
          </div>

          <div className="hidden md:flex items-center gap-1 bg-gray-100/80 p-1 rounded-xl">
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-indigo-600 shadow-sm text-sm font-semibold">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => (window.location.href = "/tasks")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 text-sm font-medium transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              My Tasks
            </button>
            <button
              onClick={() => (window.location.href = "/profile")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-200/50 text-sm font-medium transition-all"
            >
              <User className="w-4 h-4" />
              Profile
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-sm font-bold">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="hidden sm:flex items-center gap-2 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 text-sm font-medium transition-all"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-xl shadow-indigo-200 mb-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/3 -translate-y-1/3" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-1">
                Good day, {user.fullName}! 👋
              </h1>
              <p className="text-indigo-100 text-sm md:text-base">
                Here's what's happening with your tasks today.
              </p>
            </div>
            <button
              onClick={() => (window.location.href = "/tasks")}
              className="self-start md:self-auto flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-600 rounded-xl font-semibold text-sm shadow-lg hover:shadow-xl transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              New Task
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                </div>
              </div>
              <div className={`h-2 rounded-full ${stat.barBg} overflow-hidden`}>
                <div
                  className={`h-full rounded-full ${stat.barFill} transition-all duration-1000`}
                  style={{ width: `${stat.percent}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progress Card */}
          <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Overall Progress
            </h3>

            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%` }}
                />
              </div>
              <span className="text-xl font-bold text-indigo-600 min-w-[3rem] text-right">
                {completionRate}%
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              {counts.completed} of {counts.total} tasks completed
            </p>

            <div className="space-y-3">
              {[
                {
                  label: "Completed",
                  value: counts.completed,
                  color: "bg-emerald-500",
                },
                {
                  label: "In Progress",
                  value: counts.inProgress,
                  color: "bg-amber-500",
                },
                {
                  label: "Pending",
                  value: counts.pending,
                  color: "bg-red-500",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                  <span className="flex-1 text-sm text-gray-600">
                    {item.label}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Tasks */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900">Recent Tasks</h3>
              <button
                onClick={() => (window.location.href = "/tasks")}
                className="flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                View All
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {loading ? (
              <div className="py-12 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600" />
              </div>
            ) : recentTasks.length === 0 ? (
              <div className="py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <ClipboardList className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 font-medium mb-4">No tasks yet!</p>
                <button
                  onClick={() => (window.location.href = "/tasks")}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-all"
                >
                  Create First Task
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    onClick={() => (window.location.href = `/tasks/${task.id}`)}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 cursor-pointer transition-all group border border-transparent hover:border-gray-100"
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full shrink-0 ${getStatusColor(task.status)}`}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600 transition-colors">
                        {task.title}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {task.category || "No category"} •{" "}
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString()
                          : "No due date"}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-bold border shrink-0 ${getPriorityStyle(task.priority)}`}
                    >
                      {task.priority}
                    </span>
                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
