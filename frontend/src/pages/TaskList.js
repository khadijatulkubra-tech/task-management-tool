import React, { useState, useEffect } from "react";
import API from "../services/api";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    category: "",
    dueDate: "",
  });

  useEffect(() => { fetchTasks(); }, []);

  const fetchTasks = async () => {
    try {
      const res = await API.get("/Tasks");
      setTasks(res.data);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    try {
      await API.post("/Tasks", newTask);
      setNewTask({ title: "", description: "", priority: "Medium", category: "", dueDate: "" });
      setShowForm(false);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await API.delete(`/Tasks/${id}`);
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await API.put(`/Tasks/${task.id}`, { ...task, status: newStatus });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const handleEditSave = async () => {
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
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const priorityColors = {
    High: { bg: "#fee2e2", color: "#dc2626" },
    Medium: { bg: "#fef3c7", color: "#d97706" },
    Low: { bg: "#d1fae5", color: "#059669" },
  };

  const statusColors = {
    Completed: "#10b981",
    InProgress: "#f59e0b",
    Pending: "#ef4444",
  };

  // Filter logic
  const filteredTasks = tasks.filter(task => {
    const statusMatch = filterStatus === "All" || task.status === filterStatus;
    const priorityMatch = filterPriority === "All" || task.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>My Tasks</h1>
            <p style={styles.subtitle}>{filteredTasks.length} of {tasks.length} tasks</p>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button style={styles.backBtn} onClick={() => window.location.href = "/dashboard"}>
              ← Dashboard
            </button>
            <button style={styles.primaryBtn} onClick={() => setShowForm(!showForm)}>
              {showForm ? "✕ Close" : "+ New Task"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div style={styles.filtersRow}>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Status:</span>
            {["All", "Pending", "InProgress", "Completed"].map(s => (
              <button
                key={s}
                style={{
                  ...styles.filterBtn,
                  background: filterStatus === s ? "#4f46e5" : "white",
                  color: filterStatus === s ? "white" : "#555",
                  border: filterStatus === s ? "1.5px solid #4f46e5" : "1.5px solid #e5e7eb",
                }}
                onClick={() => setFilterStatus(s)}
              >
                {s}
              </button>
            ))}
          </div>
          <div style={styles.filterGroup}>
            <span style={styles.filterLabel}>Priority:</span>
            {["All", "High", "Medium", "Low"].map(p => (
              <button
                key={p}
                style={{
                  ...styles.filterBtn,
                  background: filterPriority === p ? "#4f46e5" : "white",
                  color: filterPriority === p ? "white" : "#555",
                  border: filterPriority === p ? "1.5px solid #4f46e5" : "1.5px solid #e5e7eb",
                }}
                onClick={() => setFilterPriority(p)}
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* New Task Form */}
        {showForm && (
          <div style={styles.formCard}>
            <h3 style={styles.formTitle}>Create New Task</h3>
            <form onSubmit={handleAddTask}>
              <input style={styles.input} placeholder="Task title *" value={newTask.title}
                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required />
              <textarea style={{ ...styles.input, resize: "none" }} placeholder="Description" rows={3}
                value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
                <input style={styles.input} placeholder="Category"
                  value={newTask.category} onChange={(e) => setNewTask({ ...newTask, category: e.target.value })} />
                <select style={styles.input} value={newTask.priority}
                  onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
                <input style={styles.input} type="date" value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} />
              </div>
              <button type="submit" style={{ ...styles.primaryBtn, marginTop: "8px" }}>Add Task</button>
            </form>
          </div>
        )}

        {/* Edit Modal */}
        {editTask && (
          <div style={styles.overlay}>
            <div style={styles.modal}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#1a1a2e" }}>Edit Task</h3>
                <button onClick={() => setEditTask(null)} style={styles.closeBtn}>✕</button>
              </div>

              <label style={styles.label}>Title</label>
              <input style={styles.input} value={editTask.title}
                onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} />

              <label style={styles.label}>Description</label>
              <textarea style={{ ...styles.input, resize: "none" }} rows={3} value={editTask.description}
                onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} />

              <label style={styles.label}>Category</label>
              <input style={styles.input} value={editTask.category}
                onChange={(e) => setEditTask({ ...editTask, category: e.target.value })} />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                <div>
                  <label style={styles.label}>Priority</label>
                  <select style={styles.input} value={editTask.priority}
                    onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
                <div>
                  <label style={styles.label}>Status</label>
                  <select style={styles.input} value={editTask.status}
                    onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}>
                    <option>Pending</option>
                    <option>InProgress</option>
                    <option>Completed</option>
                  </select>
                </div>
              </div>

              <label style={styles.label}>Due Date</label>
              <input style={styles.input} type="date"
                value={editTask.dueDate ? editTask.dueDate.split("T")[0] : ""}
                onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })} />

              <div style={{ display: "flex", gap: "10px", marginTop: "8px" }}>
                <button onClick={handleEditSave} style={{ ...styles.primaryBtn, flex: 1 }}>Save Changes</button>
                <button onClick={() => setEditTask(null)} style={{ ...styles.backBtn, flex: 1, textAlign: "center" }}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        {/* Task List */}
        {loading ? (
          <p style={{ textAlign: "center", color: "#999", padding: "60px" }}>Loading...</p>
        ) : filteredTasks.length === 0 ? (
          <div style={styles.emptyBox}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>📝</p>
            <p style={{ color: "#999", marginBottom: "20px" }}>
              {tasks.length === 0 ? "No tasks yet!" : "No tasks match your filters!"}
            </p>
            {tasks.length === 0 && (
              <button style={styles.primaryBtn} onClick={() => setShowForm(true)}>+ Create First Task</button>
            )}
          </div>
        ) : (
          <div style={styles.taskList}>
            {filteredTasks.map((task) => (
              <div key={task.id} style={styles.taskCard}>
                {/* Left */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", flex: 1 }}>
                  <div style={{
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: statusColors[task.status] || "#999",
                    flexShrink: 0, marginTop: "5px"
                  }} />
                  <div style={{ flex: 1 }}>
                    {/* Title — clickable for detail */}
                    <h3
                      style={{ ...styles.taskTitle, cursor: "pointer", color: "#4f46e5" }}
                      onClick={() => window.location.href = `/tasks/${task.id}`}
                      title="Click to view detail"
                    >
                      {task.title} →
                    </h3>
                    {task.description && (
                      <p style={styles.taskDesc}>{task.description}</p>
                    )}
                    <div style={{ display: "flex", gap: "16px", marginTop: "8px", flexWrap: "wrap" }}>
                      {task.category && <span style={styles.metaText}>🏷️ {task.category}</span>}
                      {task.dueDate && <span style={styles.metaText}>📅 {new Date(task.dueDate).toLocaleDateString()}</span>}
                    </div>
                  </div>
                </div>

                {/* Right */}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                  <span style={{
                    padding: "4px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "700",
                    background: priorityColors[task.priority]?.bg,
                    color: priorityColors[task.priority]?.color,
                  }}>
                    {task.priority}
                  </span>

                  <select
                    style={{
                      padding: "6px 10px", border: "1.5px solid #e5e7eb",
                      borderRadius: "8px", fontSize: "12px", fontWeight: "600",
                      color: statusColors[task.status], cursor: "pointer", outline: "none",
                    }}
                    value={task.status}
                    onChange={(e) => handleStatusChange(task, e.target.value)}
                  >
                    <option>Pending</option>
                    <option>InProgress</option>
                    <option>Completed</option>
                  </select>

                  <button onClick={() => setEditTask(task)} style={styles.editBtn} title="Edit">✏️</button>
                  <button onClick={() => handleDelete(task.id)} style={styles.deleteBtn} title="Delete">🗑️</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "#f8fafc" },
  container: { maxWidth: "1000px", margin: "0 auto", padding: "40px 24px" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" },
  title: { fontSize: "24px", fontWeight: "800", color: "#1a1a2e", marginBottom: "4px" },
  subtitle: { fontSize: "14px", color: "#888" },
  primaryBtn: {
    padding: "10px 20px", background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    color: "white", border: "none", borderRadius: "10px", fontSize: "14px",
    fontWeight: "600", cursor: "pointer",
  },
  backBtn: {
    padding: "10px 20px", background: "white", border: "1.5px solid #e5e7eb",
    borderRadius: "10px", color: "#555", fontSize: "14px", fontWeight: "600", cursor: "pointer",
  },
  filtersRow: {
    display: "flex", flexDirection: "column", gap: "10px",
    background: "white", padding: "16px 20px", borderRadius: "12px",
    marginBottom: "20px", boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
    border: "1px solid #e5e7eb",
  },
  filterGroup: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  filterLabel: { fontSize: "13px", fontWeight: "600", color: "#555", minWidth: "60px" },
  filterBtn: {
    padding: "5px 14px", borderRadius: "20px", fontSize: "12px",
    fontWeight: "600", cursor: "pointer", transition: "all 0.2s",
  },
  formCard: {
    background: "white", borderRadius: "16px", padding: "24px",
    marginBottom: "20px", boxShadow: "0 2px 15px rgba(0,0,0,0.07)",
    border: "1px solid #e5e7eb",
  },
  formTitle: { fontSize: "16px", fontWeight: "700", color: "#1a1a2e", marginBottom: "16px" },
  input: {
    width: "100%", padding: "11px 14px", border: "1.5px solid #e5e7eb",
    borderRadius: "10px", fontSize: "14px", outline: "none",
    boxSizing: "border-box", marginBottom: "12px", color: "#333",
  },
  overlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(0,0,0,0.45)", display: "flex",
    justifyContent: "center", alignItems: "center", zIndex: 1000,
  },
  modal: {
    background: "white", padding: "32px", borderRadius: "20px",
    width: "500px", maxWidth: "90vw", boxShadow: "0 25px 60px rgba(0,0,0,0.2)",
    maxHeight: "90vh", overflowY: "auto",
  },
  closeBtn: {
    background: "#f3f4f6", border: "none", borderRadius: "8px",
    width: "32px", height: "32px", cursor: "pointer", fontSize: "14px", color: "#666",
  },
  label: { display: "block", fontSize: "13px", fontWeight: "600", color: "#555", marginBottom: "6px" },
  taskList: { display: "flex", flexDirection: "column", gap: "12px" },
  taskCard: {
    background: "white", borderRadius: "14px", padding: "20px 24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #f0f0f0",
    display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px",
  },
  taskTitle: { fontSize: "15px", fontWeight: "700", marginBottom: "4px" },
  taskDesc: { fontSize: "13px", color: "#888", lineHeight: "1.5" },
  metaText: { fontSize: "12px", color: "#aaa" },
  editBtn: {
    width: "34px", height: "34px", background: "#ede9fe", border: "none",
    borderRadius: "8px", cursor: "pointer", fontSize: "15px",
  },
  deleteBtn: {
    width: "34px", height: "34px", background: "#fee2e2", border: "none",
    borderRadius: "8px", cursor: "pointer", fontSize: "15px",
  },
  emptyBox: {
    background: "white", borderRadius: "16px", padding: "60px",
    textAlign: "center", boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
};

export default TaskList;