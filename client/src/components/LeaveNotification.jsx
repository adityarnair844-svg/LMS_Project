import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { FaClipboardList } from "react-icons/fa";

const LeaveNotification = ({ onPendingChange }) => {

  const { currentUser } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.employee_id) fetchPendingLeaves();
  }, [currentUser]);

  const fetchPendingLeaves = async () => {
  try {
    const res = await axios.get(
      `http://localhost:8800/api/leave/pendingSubmissions/${currentUser.employee_id}`
    );
    const count = res.data.count || 0;
    setPendingCount(count);
    onPendingChange?.(count > 0);
  } catch (err) {
    console.error("Error fetching pending leave submissions:", err);
    onPendingChange?.(false);
  }
};


  const handleClick = () => {
    navigate("/employee/leavedashboard");
  };

  if (pendingCount === 0) return null;

  return (
    <div style={styles.banner} onClick={handleClick}>
      <FaClipboardList style={styles.icon} />
      <span style={styles.text}>
        You have {pendingCount} pending leave
        {pendingCount > 1 ? " applications" : " application"} to submit
      </span>
    </div>
  );
};

const styles = {
  banner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "14px",
    background: "#e7f5ff",
    color: "#005b96",
    border: "1px solid #b3d9ff",
    borderRadius: "8px",
    padding: "14px 0",
    fontFamily: "'Inter', sans-serif",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    margin: "20px",
    transition: "all 0.2s ease-in-out",
  },
  icon: {
    fontSize: "18px",
  },
  text: {
    fontSize: "15px",
  },
};

export default LeaveNotification;
