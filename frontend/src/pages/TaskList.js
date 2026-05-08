import React, { useState } from "react";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
  });

  const handleAddTask = (e) => {
    e.preventDefault();
    const task = { ...newTask, id: Date.now(), status: "Pending" };
    setTasks([...tasks, task]);
    setNewTask({ title: "", description: "", priority: "Medium" });
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Tasks</h1>
        <div>
          <button
            style={styles.backBtn}
            onClick={() => (window.location.href = "/dashboard")}
          >
            Dashboard
          </button>
          <button style={styles.addBtn} onClick={() => setShowForm(!showForm)}>
            + New Task
          </button>
        </div>
      </div>

      {showForm && (
        <div style={styles.form}>
          <h3 style={{ marginBottom: "16px" }}>Create New Task</h3>
          <form onSubmit={handleAddTask}>
            <input
              style={styles.input}
              placeholder="Task Title"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              required
            />
            <textarea
              style={styles.input}
              placeholder="Description"
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              rows="3"
            />
            <select
              style={styles.input}
              value={newTask.priority}
              onChange={(e) =>
                setNewTask({ ...newTask, priority: e.target.value })
              }
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
            <button style={styles.addBtn} type="submit">
              Add Task
            </button>
          </form>
        </div>
      )}

      {tasks.length === 0 ? (
        <div style={styles.empty}>
          <p>No tasks yet! Click "+ New Task" to add one.</p>
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} style={styles.taskCard}>
            <div>
              <h3 style={styles.taskTitle}>{task.title}</h3>
              <p style={styles.taskDesc}>{task.description}</p>
              <span
                style={{
                  ...styles.badge,
                  background:
                    task.priority === "High"
                      ? "#ef4444"
                      : task.priority === "Medium"
                        ? "#f59e0b"
                        : "#10b981",
                }}
              >
                {task.priority}
              </span>
              <span
                style={{
                  ...styles.badge,
                  background: "#6b7280",
                  marginLeft: "8px",
                }}
              >
                {task.status}
              </span>
            </div>
            <button
              style={styles.deleteBtn}
              onClick={() => handleDelete(task.id)}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { padding: "40px", maxWidth: "900px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  title: { fontSize: "32px", fontWeight: "bold", color: "#333" },
  backBtn: {
    padding: "10px 20px",
    background: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    marginRight: "10px",
  },
  addBtn: {
    padding: "10px 20px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  form: {
    background: "white",
    padding: "24px",
    borderRadius: "12px",
    marginBottom: "24px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
  },
  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    fontSize: "14px",
  },
  empty: {
    textAlign: "center",
    padding: "60px",
    color: "#999",
    background: "white",
    borderRadius: "12px",
  },
  taskCard: {
    background: "white",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "16px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskTitle: { fontSize: "18px", fontWeight: "600", marginBottom: "6px" },
  taskDesc: { color: "#666", marginBottom: "10px" },
  badge: {
    padding: "4px 12px",
    borderRadius: "20px",
    color: "white",
    fontSize: "12px",
  },
  deleteBtn: {
    padding: "8px 16px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default TaskList;
