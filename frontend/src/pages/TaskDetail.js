import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import {
  ArrowLeft,
  Flag,
  CheckCircle2,
  Layers,
  Calendar,
  User,
  Clock,
  AlertCircle,
} from "lucide-react";

function TaskDetail() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await API.get(`/Tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };
    fetchTask();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 font-medium">Task not found!</p>
        </div>
      </div>
    );
  }

  const getPriorityStyle = (p) => {
    if (p === "High") return "bg-red-50 text-red-700 border-red-200";
    if (p === "Medium") return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  };

  const getStatusStyle = (s) => {
    if (s === "Completed")
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (s === "InProgress") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-gray-50 text-gray-700 border-gray-200";
  };

  const infoItems = [
    {
      label: "Priority",
      value: task.priority,
      icon: Flag,
      style: getPriorityStyle(task.priority),
    },
    {
      label: "Status",
      value: task.status,
      icon: CheckCircle2,
      style: getStatusStyle(task.status),
    },
    { label: "Category", value: task.category || "N/A", icon: Layers },
    {
      label: "Due Date",
      value: task.dueDate
        ? new Date(task.dueDate).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })
        : "N/A",
      icon: Calendar,
    },
    { label: "Assigned To", value: task.assignedTo, icon: User },
    {
      label: "Created At",
      value: new Date(task.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      icon: Clock,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50/30 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => (window.location.href = "/tasks")}
          className="group flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-6 font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Tasks
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Top accent bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

          <div className="p-6 md:p-10">
            <div className="flex flex-wrap items-start gap-3 mb-4">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex-1">
                {task.title}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityStyle(task.priority)}`}
              >
                {task.priority}
              </span>
            </div>

            <p className="text-gray-600 leading-relaxed mb-8 text-base">
              {task.description || "No description provided."}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {infoItems.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-4 p-4 rounded-2xl bg-gray-50/70 border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.style ? item.style.split(" ").slice(0, 2).join(" ") : "bg-indigo-50 text-indigo-600"}`}
                  >
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                      {item.label}
                    </p>
                    <p
                      className={`text-sm font-semibold ${
                        item.style
                          ? item.style
                              .split(" ")
                              .filter((c) => c.startsWith("text-"))
                              .join(" ")
                          : "text-gray-900"
                      }`}
                    >
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskDetail;
