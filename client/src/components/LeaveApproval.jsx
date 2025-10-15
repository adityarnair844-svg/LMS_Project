import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const LeaveApprovalPage = () => {
  const { currentUser } = useContext(AuthContext);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedAction, setSelectedAction] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reason, setReason] = useState("");

  const fetchLeaveApplications = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/leave/pendingApprovals/${currentUser.employee_id}`
      );
      setLeaveApplications(res.data);
    } catch (err) {
      console.error("Error fetching leave applications:", err);
    }
  };

  const handleAction = (leave, action) => {
    setSelectedLeave(leave);
    setSelectedAction(action);
    setShowModal(true);
  };

  const submitAction = async () => {
    try {
      await axios.post("http://localhost:8800/api/leave/updateStatus", {
        leave_application_id: selectedLeave.leave_application_id,
        status_name: selectedAction,
        status_note: reason,
      });
      setShowModal(false);
      setReason("");
      fetchLeaveApplications();
    } catch (err) {
      console.error("Error updating leave status:", err);
    }
  };

  useEffect(() => {
    fetchLeaveApplications();
  }, []);

  return (
    <div
      className="leave-approval-container"
      style={{
        padding: "40px",
        fontFamily: "serif",
        backgroundColor: "#f7f9fa",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
          padding: "24px 32px",
          maxWidth: "95%",
          margin: "0 auto",
        }}
      >
        <h2
          style={{
            color: "#045b5b",
            fontWeight: "600",
            marginBottom: "24px",
            textAlign: "center",
          }}
        >
          Pending Leaves for Approval
        </h2>

        {leaveApplications.length === 0 ? (
          <p
            style={{
              color: "#888",
              textAlign: "center",
              padding: "40px",
              fontSize: "16px",
            }}
          >
            No pending leave applications.
          </p>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                overflow: "hidden",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#e9f4f4",
                    color: "#045b5b",
                    textAlign: "left",
                    fontSize: "14px",
                  }}
                >
                  <th style={{ padding: "14px 16px" }}>Application ID</th>
                  <th style={{ padding: "14px 16px" }}>Employee ID</th>
                  <th style={{ padding: "14px 16px" }}>Name</th>
                  <th style={{ padding: "14px 16px" }}>Leave Type</th>
                  <th style={{ padding: "14px 16px" }}>Purpose</th>
                  <th style={{ padding: "14px 16px" }}>Start Date</th>
                  <th style={{ padding: "14px 16px" }}>End Date</th>
                  <th style={{ padding: "14px 16px" }}>No. of Days</th>
                  <th style={{ padding: "14px 16px" }}>Status</th>
                  <th style={{ padding: "14px 16px", textAlign: "center" }}>
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaveApplications.map((leave) => (
                  <tr
                    key={leave.leave_application_id}
                    style={{
                      borderBottom: "1px solid #e5e7eb",
                      transition: "background-color 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#f9fdfd")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "white")
                    }
                  >
                    <td style={{ padding: "12px 16px" }}>
                      {leave.leave_application_id}
                    </td>
                    <td style={{ padding: "12px 16px" }}>{leave.employee_id}</td>
                    <td style={{ padding: "12px 16px" }}>{leave.employee_name}</td>
                    <td style={{ padding: "12px 16px" }}>{leave.leave_type_name}</td>
                    <td style={{ padding: "12px 16px" }}>{leave.leave_purpose}</td>
                    <td style={{ padding: "12px 16px" }}>{leave.start_date}</td>
                    <td style={{ padding: "12px 16px" }}>{leave.end_date}</td>
                    <td style={{ padding: "12px 16px" }}>{leave.no_of_days}</td>
                    <td style={{ padding: "12px 16px" }}>{leave.status_name}</td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "12px 16px",
                        display: "flex",
                        justifyContent: "center",
                        gap: "12px",
                      }}
                    >
                      <span
                        onClick={() => handleAction(leave, "Approved")}
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "green",
                          transition: "transform 0.2s ease",
                        }}
                        title="Approve"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        ✓
                      </span>
                      <span
                        onClick={() => handleAction(leave, "Rejected")}
                        style={{
                          cursor: "pointer",
                          fontSize: "20px",
                          color: "#dc3545",
                          transition: "transform 0.2s ease",
                        }}
                        title="Reject"
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.transform = "scale(1.2)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.transform = "scale(1)")
                        }
                      >
                        ✕
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              background: "white",
              borderRadius: "10px",
              padding: "28px",
              width: "400px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
            }}
          >
            <h3 style={{ color: "#045b5b", marginBottom: "16px" }}>
              {selectedAction === "Approved" ? "Approve" : "Reject"} Leave
            </h3>
            <p>
              <strong>ID:</strong> {selectedLeave?.leave_application_id}
            </p>
            <p>
              <strong>Employee:</strong> {selectedLeave?.employee_name}
            </p>
            <textarea
              placeholder={`Enter reason for ${selectedAction.toLowerCase()}...`}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              style={{
                width: "100%",
                height: "80px",
                marginTop: "12px",
                borderRadius: "6px",
                border: "1px solid #ccc",
                padding: "10px",
                fontFamily: "inherit",
                fontSize: "14px",
                resize: "none",
              }}
            ></textarea>

            <div
              style={{
                marginTop: "20px",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                onClick={() => setShowModal(false)}
                style={{
                  backgroundColor: "#ccc",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={submitAction}
                style={{
                  backgroundColor:
                    selectedAction === "Approved" ? "green" : "#dc3545",
                  color: "white",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveApprovalPage;
