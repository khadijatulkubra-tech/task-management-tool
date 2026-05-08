import React from "react";

function Dashboard() {
  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Dashboard</h1>
        <button style={styles.logout}>Logout</button>
      </div>

      <div style={styles.cards}>
        <div style={{ ...styles.card, background: "#4f46e5" }}>
          <h3 style={styles.cardTitle}>Total Tasks</h3>
          <p style={styles.cardNumber}>0</p>
        </div>
        <div style={{ ...styles.card, background: "#f59e0b" }}>
          <h3 style={styles.cardTitle}>In Progress</h3>
          <p style={styles.cardNumber}>0</p>
        </div>
        <div style={{ ...styles.card, background: "#10b981" }}>
          <h3 style={styles.cardTitle}>Completed</h3>
          <p style={styles.cardNumber}>0</p>
        </div>
        <div style={{ ...styles.card, background: "#ef4444" }}>
          <h3 style={styles.cardTitle}>Pending</h3>
          <p style={styles.cardNumber}>0</p>
        </div>
      </div>

      <button
        style={styles.taskBtn}
        onClick={() => (window.location.href = "/tasks")}
      >
        View All Tasks
      </button>
    </div>
  );
}

const styles = {
  container: { padding: "40px", maxWidth: "1200px", margin: "0 auto" },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  title: { fontSize: "32px", fontWeight: "bold", color: "#333" },
  logout: {
    padding: "10px 20px",
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "40px",
  },
  card: {
    padding: "30px",
    borderRadius: "12px",
    color: "white",
    textAlign: "center",
  },
  cardTitle: { fontSize: "16px", marginBottom: "10px", opacity: "0.9" },
  cardNumber: { fontSize: "48px", fontWeight: "bold" },
  taskBtn: {
    padding: "14px 28px",
    background: "#4f46e5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    cursor: "pointer",
  },
};

export default Dashboard;
