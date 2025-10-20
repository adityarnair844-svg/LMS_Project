import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaSave, FaPlus, FaTimes } from "react-icons/fa";

const Announcement = ({ isAdmin }) => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  // Admin state
  const [newHeading, setNewHeading] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editing, setEditing] = useState(null);
  const [backup, setBackup] = useState({});

  // Employee/Manager state
  const [expandedId, setExpandedId] = useState(null);
  const [readAnnouncements, setReadAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:8800/api/announcement");
      let data = res.data;
      if (!isAdmin) {
        data = data
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 10);
      }
      setAnnouncements(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load announcements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  // --- Admin Functions ---
  const handleAdd = async () => {
    if (!newHeading.trim() || !newContent.trim())
      return alert("Enter all fields");
    try {
      await axios.post("http://localhost:8800/api/announcement", {
        heading: newHeading,
        content: newContent,
      });
      setNewHeading("");
      setNewContent("");
      await fetchAnnouncements();
      alert("Announcement added!");
    } catch (err) {
      console.error(err);
      alert("Failed to add announcement");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this announcement?"))
      return;
    try {
      await axios.delete(`http://localhost:8800/api/announcement/${id}`);
      setAnnouncements((prev) =>
        prev.filter((a) => a.announcement_id !== id)
      );
      alert("Announcement deleted!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete announcement");
    }
  };

  const handleSaveEdit = async (id, heading, content) => {
    try {
      await axios.put(`http://localhost:8800/api/announcement/${id}`, {
        heading,
        content,
      });
      setEditing(null);
      await fetchAnnouncements();
      alert("Announcement updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update announcement");
    }
  };

  const handleCancelEdit = (id) => {
    setAnnouncements((prev) =>
      prev.map((a) =>
        a.announcement_id === id
          ? { ...a, heading: backup.heading, content: backup.content }
          : a
      )
    );
    setEditing(null);
  };

  const markAsRead = (id) => {
    if (!readAnnouncements.includes(id)) {
      setReadAnnouncements((prev) => [...prev, id]);
    }
    setExpandedId(id);
  };

  return (
    <div
      style={{
        ...styles.cardContainer,
        height: isAdmin ? "600px" : "auto",
      }}
    >
      {/* Admin: Add New */}
      {isAdmin && (
        <div style={styles.addBox}>
          <h3 style={styles.sectionTitle}>Create New Announcement</h3>
          <input
            style={styles.input}
            type="text"
            placeholder="Heading"
            value={newHeading}
            onChange={(e) => setNewHeading(e.target.value)}
          />
          <textarea
            style={styles.textarea}
            placeholder="Write announcement..."
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />
          <button
            style={{ ...styles.btn, ...styles.addBtn }}
            onClick={handleAdd}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#0f75d1")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#1890ff")}
          >
            <FaPlus /> Add
          </button>
        </div>
      )}

      {/* Scrollable Announcements List */}
      <div
        style={{
          ...styles.scrollableList,
          maxHeight: isAdmin ? "500px" : "360px",
        }}
      >
        {loading && <p>Loading announcements...</p>}
        {announcements.length === 0 && !loading && <p>No announcements yet.</p>}

        {announcements.map((a) => {
          // --- Employee/Manager view ---
          if (!isAdmin) {
            const isRead = readAnnouncements.includes(a.announcement_id);
            if (expandedId !== a.announcement_id) {
              // Collapsed banner
              return (
                <div
                  key={a.announcement_id}
                  style={{
                    ...styles.bannerCard,
                    cursor: "pointer",
                    transition: "all 0.3s",
                    display: "flex",
                    flexDirection: "column",
                    padding: "15px",
                    borderLeft: `4px solid ${isRead ? "#bbb" : "#1890ff"}`,
                    background: isRead ? "#f5f5f5" : "#e6f7ff",
                  }}
                  onClick={() => markAsRead(a.announcement_id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 8px 18px rgba(0,0,0,0.18)";
                    e.currentTarget.style.background = isRead ? "#eee" : "#d0ebff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 2px 8px rgba(0,0,0,0.08)";
                    e.currentTarget.style.background = isRead ? "#f5f5f5" : "#e6f7ff";
                  }}
                >
                  <strong style={{ fontSize: "1.05rem", color: "#025b5b" }}>
                    {a.heading}
                  </strong>
                  <small style={{ color: "#555", marginTop: "5px" }}>
                    Click to view details
                  </small>
                </div>
              );
            }

            // Expanded full view
            return (
              <div
                key={a.announcement_id}
                style={{
                  ...styles.card,
                  padding: "20px",
                  background: "#f0f5f5",
                  border: "1px solid #91d5ff",
                  display: "flex",
                  flexDirection: "column",
                  maxHeight: "360px",
                }}
              >
                <h2 style={{ ...styles.expandedHeading, textAlign: "center" }}>
                  {a.heading}
                </h2>

                <div
                  style={{
                    overflowY: "auto",
                    maxHeight: "240px",
                    padding: "10px 15px",
                    textAlign: "justify",
                    whiteSpace: "pre-wrap",
                  }}
                >
                  <p style={{ ...styles.expandedContent, margin: 0 }}>
                    {a.content}
                  </p>
                </div>

                <small style={{ ...styles.date, alignSelf: "flex-end" }}>
                  Posted on {new Date(a.created_at).toLocaleString()}
                </small>

                <button
                  style={{
                    ...styles.btn,
                    ...styles.cancelBtn,
                    marginTop: "10px",
                    alignSelf: "center",
                  }}
                  onClick={() => setExpandedId(null)}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#666")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "#888")}
                >
                  Back
                </button>
              </div>
            );
          }

          // --- Admin view remains unchanged ---
          return (
            <div key={a.announcement_id} style={styles.card}>
              {editing === a.announcement_id ? (
                <>
                  <input
                    style={styles.input}
                    type="text"
                    value={a.heading}
                    onChange={(e) =>
                      setAnnouncements((prev) =>
                        prev.map((x) =>
                          x.announcement_id === a.announcement_id
                            ? { ...x, heading: e.target.value }
                            : x
                        )
                      )
                    }
                  />
                  <textarea
                    style={styles.textarea}
                    value={a.content}
                    onChange={(e) =>
                      setAnnouncements((prev) =>
                        prev.map((x) =>
                          x.announcement_id === a.announcement_id
                            ? { ...x, content: e.target.value }
                            : x
                        )
                      )
                    }
                  />
                  <div style={styles.actionRow}>
                    <button
                      style={{ ...styles.btn, ...styles.saveBtn }}
                      onClick={() =>
                        handleSaveEdit(a.announcement_id, a.heading, a.content)
                      }
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#389e0d")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#52c41a")}
                    >
                      <FaSave /> Save
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.cancelBtn }}
                      onClick={() => handleCancelEdit(a.announcement_id)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#555")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#888")}
                    >
                      <FaTimes /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h4 style={styles.heading}>{a.heading}</h4>
                  <p style={styles.content}>{a.content}</p>
                  <small style={styles.date}>
                    Posted on {new Date(a.created_at).toLocaleString()}
                  </small>
                  <div style={styles.actionRow}>
                    <button
                      style={{ ...styles.btn, ...styles.editBtn }}
                      onClick={() => {
                        setEditing(a.announcement_id);
                        setBackup({ heading: a.heading, content: a.content });
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#e0a800")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#ffc107")}
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      style={{ ...styles.btn, ...styles.deleteBtn }}
                      onClick={() => handleDelete(a.announcement_id)}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#cf1322")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#f5222d")}
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const styles = {
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    background: "#f5f5f5",
    padding: "15px",
    borderRadius: "12px",
    boxSizing: "border-box",
  },
  scrollableList: {
    overflowY: "auto",
    flex: 1,
    paddingRight: "5px",
  },
  addBox: {
    background: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "20px",
    marginBottom: "15px",
  },
  sectionTitle: { marginBottom: "10px", color: "#333" },
  card: {
    background: "#fff",
    border: "1px solid #ddd",
    borderRadius: "12px",
    padding: "15px",
    marginBottom: "10px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    display: "flex",
    flexDirection: "column",
  },
  bannerCard: {
    borderRadius: "12px",
    marginBottom: "10px",
  },
  heading: { margin: "0 0 5px 0", color: "#2b3e50" },
  content: { color: "#444", marginBottom: "8px" },
  expandedHeading: {
    fontSize: "1.3rem",
    marginBottom: "10px",
    color: "#025b5b",
  },
  expandedContent: {
    fontSize: "1rem",
    color: "#333",
    lineHeight: "1.5",
  },
  date: { fontSize: "0.85rem", color: "#777" },
  input: {
    width: "100%",
    padding: "8px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "6px",
  },
  textarea: {
    width: "100%",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    minHeight: "80px",
    resize: "vertical",
    marginBottom: "10px",
  },
  actionRow: { display: "flex", gap: "10px", marginTop: "10px" },
  btn: {
    border: "none",
    padding: "8px 12px",
    borderRadius: "6px",
    cursor: "pointer",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "5px",
  },
  addBtn: { background: "#1890ff" },
  editBtn: { background: "#ffc107", color: "#000" },
  deleteBtn: { background: "#f5222d" },
  saveBtn: { background: "#52c41a" },
  cancelBtn: { background: "#888" },
};

export default Announcement;
