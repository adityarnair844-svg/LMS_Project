import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { FaBell } from "react-icons/fa";

const ManagerNotification = () => {
  const { currentUser } = useContext(AuthContext);
  const [pendingCount, setPendingCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser?.employee_id) fetchPendingApprovals();
  }, [currentUser]);

  const fetchPendingApprovals = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/leave/pendingApprovalsCount/${currentUser.employee_id}`
      );
      setPendingCount(res.data.count || 0);
    } catch (err) {
      console.error("Error fetching pending approvals:", err);
    }
  };

  const handleClick = () => {
    navigate("/manager/approval");
  };

  if (pendingCount === 0) return null;

  return (
    <div style={styles.banner} onClick={handleClick}>
      <FaBell style={styles.icon} />
      <span style={styles.text}>
        {pendingCount} leave request{pendingCount > 1 ? "s" : ""} pending for approval
      </span>
    </div>
  );
};

const styles = {
  banner: {
    // position: "fixed",          // 👈 fixed position (always visible)
    // bottom: 0,                  // 👈 sticks to bottom
    // left: 0,
    
    // width: "100%",              // 👈 full-width bar
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "20px",
    background: "#fff7e6",
    color: "#b26a00",
    borderTop: "1px solid #ffcc80",
    padding: "14px 0",
    fontFamily: "'Inter', serif",
    fontSize: "15px",
    fontWeight: "500",
    cursor: "pointer",
    boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
    // transition: "background 0.2s ease-in-out",
    margin: "20px",
  },
  icon: {
    fontSize: "18px",
  },
  text: {
    fontSize: "15px",
  },
};

export default ManagerNotification;
