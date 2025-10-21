import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const LeaveHistoryManager = () => {
  const { currentUser } = useContext(AuthContext);
  const [leaves, setLeaves] = useState([]);

  useEffect(() => {
    if (currentUser?.employee_id) fetchLeaveHistory();
  }, [currentUser]);

  const fetchLeaveHistory = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/leave/history/${currentUser.employee_id}`
      );
      setLeaves(res.data);
    } catch (err) {
      console.error("Error fetching leave history:", err);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  };

  return (
    <div style={{ padding: "20px", fontFamily: "serif" }}>
      <h2>Leave Approval History</h2>
      <div style={{ overflowX: "auto", marginTop: "20px" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#025b5b", color: "#fff" }}>
              <th style={styles.th}>Req ID</th>
              <th style={styles.th}>Employee</th>
              <th style={styles.th}>Leave Type</th>
              <th style={styles.th}>Leave Period</th>
              <th style={styles.th}>No. of Days</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Note</th>
            </tr>
          </thead>
          <tbody>
            {leaves.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center", padding: "20px" }}>
                  No leave history found.
                </td>
              </tr>
            ) : (
              leaves.map((l, idx) => (
                <tr key={l.leave_application_id} style={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                  <td style={styles.td}>{l.leave_application_id}</td>
                  <td style={styles.td}>{l.first_name} {l.last_name}</td>
                  <td style={styles.td}>{l.leave_type_name}</td>
                  <td style={styles.td}>{formatDate(l.start_date)} - {formatDate(l.end_date)}</td>
                  <td style={styles.td}>{l.no_of_days}</td>
                  <td style={{...styles.td, fontWeight: "bold", color: l.status_name === "Approved" ? "green" : "red"}}>
                    {l.status_name}
                  </td>
                  <td style={styles.td}>{l.status_note || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const styles = {
  th: {
    padding: "12px",
    border: "1px solid #ccc",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    border: "1px solid #e0e0e0",
  },
  rowEven: { background: "#fff" },
  rowOdd: { background: "#f9f9f9" },
};

export default LeaveHistoryManager;
