import React, { useState, useEffect } from 'react';
import API from '../services/api';

function AdminDashboard() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterUser, setFilterUser] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editTask, setEditTask] = useState(null);
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks');
  const [assignTask, setAssignTask] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    category: '',
    dueDate: '',
    userId: '',
  });
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [tasksRes, usersRes] = await Promise.all([
        API.get('/Tasks'),
        API.get('/Users')
      ]);
      setTasks(tasksRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/admin';
  };

  const handleStatusUpdate = async (task, newStatus) => {
    try {
      await API.put(`/Tasks/${task.id}`, {
        title: task.title,
        description: task.description,
        priority: task.priority,
        status: newStatus,
        category: task.category,
        dueDate: task.dueDate
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSave = async () => {
    try {
      await API.put(`/Tasks/${editTask.id}`, {
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        status: editTask.status,
        category: editTask.category,
        dueDate: editTask.dueDate
      });
      setEditTask(null);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignTask = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/Tasks/assign?userId=${assignTask.userId}`, {
        title: assignTask.title,
        description: assignTask.description,
        priority: assignTask.priority,
        category: assignTask.category,
        dueDate: assignTask.dueDate,
      });
      setAssignTask({ title: '', description: '', priority: 'Medium', category: '', dueDate: '', userId: '' });
      setShowAssignForm(false);
      fetchData();
      alert('Task assigned successfully!');
    } catch (err) {
      console.error(err);
      alert('Error assigning task!');
    }
  };

  const uniqueUserNames = ['All', ...new Set(tasks.map(t => t.assignedTo))];
  const filteredTasks = tasks.filter(t => {
    const userMatch = filterUser === 'All' || t.assignedTo === filterUser;
    const statusMatch = filterStatus === 'All' || t.status === filterStatus;
    return userMatch && statusMatch;
  });

  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter(t => t.status === 'Pending').length;
  const inProgressTasks = tasks.filter(t => t.status === 'InProgress').length;
  const completedTasks = tasks.filter(t => t.status === 'Completed').length;
  const totalUsers = users.filter(u => u.role !== 'Admin').length;

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div>
          <h1 style={styles.title}>👑 Admin Dashboard</h1>
          <p style={styles.subtitle}>Welcome, {user.fullName}</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={styles.assignBtn} onClick={() => setShowAssignForm(!showAssignForm)}>
            {showAssignForm ? '✕ Close' : '+ Assign Task'}
          </button>
          <button style={styles.logout} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}>
          <div style={styles.cardIcon}>👥</div>
          <h3 style={styles.cardTitle}>Total Users</h3>
          <p style={styles.cardNumber}>{totalUsers}</p>
        </div>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #4f46e5, #4338ca)' }}>
          <div style={styles.cardIcon}>📋</div>
          <h3 style={styles.cardTitle}>Total Tasks</h3>
          <p style={styles.cardNumber}>{totalTasks}</p>
        </div>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}>
          <div style={styles.cardIcon}>⏳</div>
          <h3 style={styles.cardTitle}>In Progress</h3>
          <p style={styles.cardNumber}>{inProgressTasks}</p>
        </div>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
          <div style={styles.cardIcon}>✅</div>
          <h3 style={styles.cardTitle}>Completed</h3>
          <p style={styles.cardNumber}>{completedTasks}</p>
        </div>
        <div style={{ ...styles.card, background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}>
          <div style={styles.cardIcon}>🔴</div>
          <h3 style={styles.cardTitle}>Pending</h3>
          <p style={styles.cardNumber}>{pendingTasks}</p>
        </div>
      </div>

      {/* Assign Task Form */}
      {showAssignForm && (
        <div style={styles.assignForm}>
          <h3 style={styles.formTitle}>📌 Assign Task to User</h3>
          <form onSubmit={handleAssignTask}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={styles.label}>Assign To User *</label>
                <select
                  style={styles.input}
                  value={assignTask.userId}
                  onChange={(e) => setAssignTask({ ...assignTask, userId: e.target.value })}
                  required
                >
                  <option value="">Select User</option>
                  {users.filter(u => u.role !== 'Admin').map(u => (
                    <option key={u.id} value={u.id}>{u.fullName} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={styles.label}>Task Title *</label>
                <input
                  style={styles.input}
                  placeholder="Enter task title"
                  value={assignTask.title}
                  onChange={(e) => setAssignTask({ ...assignTask, title: e.target.value })}
                  required
                />
              </div>
            </div>

            <div>
              <label style={styles.label}>Description</label>
              <textarea
                style={{ ...styles.input, resize: 'none' }}
                placeholder="Task description"
                rows={2}
                value={assignTask.description}
                onChange={(e) => setAssignTask({ ...assignTask, description: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
              <div>
                <label style={styles.label}>Category</label>
                <input
                  style={styles.input}
                  placeholder="Category"
                  value={assignTask.category}
                  onChange={(e) => setAssignTask({ ...assignTask, category: e.target.value })}
                />
              </div>
              <div>
                <label style={styles.label}>Priority</label>
                <select
                  style={styles.input}
                  value={assignTask.priority}
                  onChange={(e) => setAssignTask({ ...assignTask, priority: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Due Date</label>
                <input
                  style={styles.input}
                  type="date"
                  value={assignTask.dueDate}
                  onChange={(e) => setAssignTask({ ...assignTask, dueDate: e.target.value })}
                />
              </div>
            </div>

            <button type="submit" style={styles.assignBtn}>
              ✅ Assign Task
            </button>
          </form>
        </div>
      )}

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={{ ...styles.tab, ...(activeTab === 'tasks' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('tasks')}
        >
          📋 All Tasks
        </button>
        <button
          style={{ ...styles.tab, ...(activeTab === 'users' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('users')}
        >
          👥 All Users
        </button>
      </div>

      {/* Edit Modal */}
      {editTask && (
        <div style={styles.modal}>
          <div style={styles.modalCard}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1a1a2e' }}>✏️ Edit Task</h3>
              <button onClick={() => setEditTask(null)} style={styles.closeBtn}>✕</button>
            </div>
            <label style={styles.label}>Title</label>
            <input style={styles.input} value={editTask.title} onChange={(e) => setEditTask({ ...editTask, title: e.target.value })} />
            <label style={styles.label}>Description</label>
            <textarea style={{ ...styles.input, resize: 'none' }} rows={3} value={editTask.description} onChange={(e) => setEditTask({ ...editTask, description: e.target.value })} />
            <label style={styles.label}>Category</label>
            <input style={styles.input} value={editTask.category} onChange={(e) => setEditTask({ ...editTask, category: e.target.value })} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={styles.label}>Priority</label>
                <select style={styles.input} value={editTask.priority} onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div>
                <label style={styles.label}>Status</label>
                <select style={styles.input} value={editTask.status} onChange={(e) => setEditTask({ ...editTask, status: e.target.value })}>
                  <option>Pending</option>
                  <option>InProgress</option>
                  <option>Completed</option>
                </select>
              </div>
            </div>
            <label style={styles.label}>Due Date</label>
            <input style={styles.input} type="date" value={editTask.dueDate ? editTask.dueDate.split('T')[0] : ''} onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })} />
            <div style={{ display: 'flex', gap: '10px', marginTop: '8px' }}>
              <button style={styles.assignBtn} onClick={handleEditSave}>Save Changes</button>
              <button style={styles.cancelBtn} onClick={() => setEditTask(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div style={styles.tableContainer}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={styles.tableTitle}>All Tasks ({filteredTasks.length})</h2>
            <div style={{ display: 'flex', gap: '12px' }}>
              <select style={styles.filterSelect} value={filterUser} onChange={(e) => setFilterUser(e.target.value)}>
                {uniqueUserNames.map(u => <option key={u}>{u}</option>)}
              </select>
              <select style={styles.filterSelect} value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="All">All Status</option>
                <option>Pending</option>
                <option>InProgress</option>
                <option>Completed</option>
              </select>
            </div>
          </div>
          {loading ? <p>Loading...</p> : filteredTasks.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', padding: '40px' }}>No tasks found!</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr style={styles.tableHeaderRow}>
                  <th style={styles.th}>#</th>
                  <th style={styles.th}>Title</th>
                  <th style={styles.th}>Assigned To</th>
                  <th style={styles.th}>Priority</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Category</th>
                  <th style={styles.th}>Due Date</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, index) => (
                  <tr key={task.id} style={styles.tableRow}>
                    <td style={styles.td}>{index + 1}</td>
                    <td style={styles.td}><strong>{task.title}</strong></td>
                    <td style={styles.td}>{task.assignedTo}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.badge, background: task.priority === 'High' ? '#fee2e2' : task.priority === 'Medium' ? '#fef3c7' : '#d1fae5', color: task.priority === 'High' ? '#dc2626' : task.priority === 'Medium' ? '#d97706' : '#059669' }}>
                        {task.priority}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <select style={styles.statusSelect} value={task.status} onChange={(e) => handleStatusUpdate(task, e.target.value)}>
                        <option>Pending</option>
                        <option>InProgress</option>
                        <option>Completed</option>
                      </select>
                    </td>
                    <td style={styles.td}>{task.category || 'N/A'}</td>
                    <td style={styles.td}>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                    <td style={styles.td}>
                      <button style={styles.editBtn} onClick={() => setEditTask(task)}>✏️ Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* Users Tab */}
      {activeTab === 'users' && (
        <div style={styles.tableContainer}>
          <h2 style={styles.tableTitle}>All Users ({totalUsers})</h2>
          <table style={styles.table}>
            <thead>
              <tr style={styles.tableHeaderRow}>
                <th style={styles.th}>#</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Email</th>
                <th style={styles.th}>Role</th>
                <th style={styles.th}>Tasks</th>
                <th style={styles.th}>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.filter(u => u.role !== 'Admin').map((u, index) => (
                <tr key={u.id} style={styles.tableRow}>
                  <td style={styles.td}>{index + 1}</td>
                  <td style={styles.td}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={styles.avatar}>{u.fullName?.charAt(0).toUpperCase()}</div>
                      <strong>{u.fullName}</strong>
                    </div>
                  </td>
                  <td style={styles.td}>{u.email}</td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: '#ede9fe', color: '#4f46e5' }}>{u.role}</span>
                  </td>
                  <td style={styles.td}>
                    <span style={{ ...styles.badge, background: '#f3f4f6', color: '#555' }}>{u.taskCount} Tasks</span>
                  </td>
                  <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' },
  title: { fontSize: '28px', fontWeight: '800', color: '#1e1b4b' },
  subtitle: { color: '#888', marginTop: '4px', fontSize: '14px' },
  logout: { padding: '10px 20px', background: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  assignBtn: { padding: '10px 20px', background: 'linear-gradient(135deg, #4f46e5, #7c3aed)', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  cards: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' },
  card: { padding: '20px', borderRadius: '16px', color: 'white', textAlign: 'center', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' },
  cardIcon: { fontSize: '24px', marginBottom: '8px' },
  cardTitle: { fontSize: '12px', marginBottom: '6px', opacity: '0.9', fontWeight: '600' },
  cardNumber: { fontSize: '36px', fontWeight: '800' },
  assignForm: { background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 2px 15px rgba(0,0,0,0.07)', border: '1px solid #e5e7eb' },
  formTitle: { fontSize: '16px', fontWeight: '700', color: '#1a1a2e', marginBottom: '16px' },
  label: { display: 'block', fontSize: '13px', fontWeight: '600', color: '#555', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', boxSizing: 'border-box', marginBottom: '12px', color: '#333' },
  tabs: { display: 'flex', gap: '8px', marginBottom: '20px' },
  tab: { padding: '10px 24px', border: '1.5px solid #e5e7eb', borderRadius: '8px', background: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#666' },
  activeTab: { background: '#4f46e5', color: 'white', border: '1.5px solid #4f46e5' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
  modalCard: { background: 'white', padding: '32px', borderRadius: '16px', width: '500px', maxWidth: '90vw', boxShadow: '0 20px 60px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' },
  closeBtn: { background: '#f3f4f6', border: 'none', borderRadius: '8px', width: '32px', height: '32px', cursor: 'pointer', fontSize: '14px', color: '#666' },
  cancelBtn: { flex: 1, padding: '10px 20px', background: '#f3f4f6', color: '#555', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' },
  tableContainer: { background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 2px 10px rgba(0,0,0,0.06)' },
  tableTitle: { fontSize: '16px', fontWeight: '700', color: '#333' },
  filterSelect: { padding: '8px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeaderRow: { background: '#f8fafc' },
  th: { padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#666', fontSize: '13px', borderBottom: '2px solid #e2e8f0' },
  tableRow: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 16px', color: '#333', fontSize: '13px' },
  badge: { padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontWeight: '600' },
  statusSelect: { padding: '4px 8px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '12px', cursor: 'pointer' },
  editBtn: { padding: '6px 12px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' },
  avatar: { width: '32px', height: '32px', background: '#4f46e5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700', fontSize: '14px' },
};

export default AdminDashboard;