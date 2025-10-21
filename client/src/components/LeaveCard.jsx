import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const LeaveCard = ({ onCardClick, activeStatus , refreshTrigger}) => {
  const { currentUser } = useContext(AuthContext);
  const [stats, setStats] = useState({
    saved: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });

  useEffect(() => {
    if (currentUser?.employee_id) fetchLeaveStats();
  }, [currentUser, refreshTrigger]);

  const fetchLeaveStats = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/leave/summary/${currentUser.employee_id}`
      );
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching leave summary:", err);
    }
  };

  const cardItems = [
    { key: "saved", label: "Pending for Submission", value: stats.saved, color: "#6d4f2697" },
    { key: "pending", label: "Pending for Approval", value: stats.pending, color: "#1d728c9a" },
    { key: "approved", label: "Approved", value: stats.approved, color: "#194119a5" },
    { key: "rejected", label: "Rejected", value: stats.rejected, color: "#662826a7" },
  ];

  return (
    <div style={styles.container}>
      {cardItems.map((item, index) => (
        <div
          key={index}
          onClick={() => item.key !== "saved" && onCardClick(item.key)}
          style={{
            ...styles.card,
            borderLeft: `6px solid ${item.color}`,
            backgroundColor: activeStatus === item.key ? "#f7f7f7" : "#fff",
            cursor: item.key !== "saved" ? "pointer" : "default",
          }}
        >
          <div style={styles.count}>{item.value}</div>
          <div style={{ ...styles.label, color: item.color }}>{item.label}</div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "20px",
    width: "100%",
    margin: "20px 0px",
  },
  card: {
    background: "#fff",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    textAlign: "center",
    transition: "0.2s ease",
  },
  count: {
    fontSize: "32px",
    fontWeight: "700",
    marginBottom: "10px",
    fontFamily: "serif"
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    fontFamily: "serif"
  },
};

export default LeaveCard;
