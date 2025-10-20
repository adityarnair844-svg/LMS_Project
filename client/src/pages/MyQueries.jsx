import React, { useContext, useState } from "react";
import CardBox from "../components/CardBox";
import { AuthContext } from "../context/authContext";
import { FaQuestionCircle, FaChevronDown, FaChevronUp } from "react-icons/fa";

const MyQueries = () => {
  const { currentUser } = useContext(AuthContext);
  const [openQueryId, setOpenQueryId] = useState(null);

  const toggleQuery = (id) => {
    setOpenQueryId(openQueryId === id ? null : id);
  };

  // Base employee queries
  const baseEmployeeQueries = [
    { id: 1, question: "How can I apply for leave?", answer: "Go to the Leave section, click Leave Dashboard, and fill in your leave request details." },
    { id: 2, question: "Who can approve my leave?", answer: "Your assigned manager will review and approve your leave request." },
    { id: 3, question: "How do I update my contact details?", answer: "Contact the admin via the Helpdesk section or email support." },
  ];

  // Manager additional queries
  const managerExtraQueries = [
    { id: 4, question: "How can I approve or reject leave requests?", answer: "Open the Leave Approval section in your dashboard and update the status." },
    { id: 5, question: "Can I view employees under another manager?", answer: "No, managers can only view and manage employees assigned to them." },
    { id: 6, question: "How do I submit announcements for my team?", answer: "Managers can send requests to the admin through the Helpdesk section." },
  ];

  // Admin queries
  const adminQueries = [
    { id: 1, question: "How can I add a new employee?", answer: "Go to Employee Management → Add Employee and fill in the required details." },
    { id: 2, question: "How do I edit employee details or reset a password?", answer: "Use the Edit Employee option under Employee Management to update information or reset passwords." },
    { id: 3, question: "How do I remove an inactive employee?", answer: "Select Delete Employee from the Employee Management section and confirm the action." },
    { id: 4, question: "How can I add or modify leave types?", answer: "Use the Leave Type Management option in your admin panel to create or edit available leave types." },
    { id: 5, question: "Can I edit announcements after posting?", answer: "Yes, announcements can be edited or deleted directly from the Admin Dashboard." },
  ];

  const role = currentUser?.role?.toLowerCase() || "employee";

  const displayedQueries =
    role === "admin"
      ? adminQueries
      : role === "manager"
      ? [...baseEmployeeQueries, ...managerExtraQueries]
      : baseEmployeeQueries;

  return (
    <div className="my-queries" style={{ padding: "2rem", marginTop: "1.5rem" }}>
      <CardBox
        title={
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "1.8rem", color: "#20f2c8ff" }}>
            <FaQuestionCircle style={{ color: "blue" }} /> My Queries
          </div>
        }
        className="shadow-lg rounded-2xl p-8"
      >
        <div className="queries-container" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {displayedQueries.map((q) => (
            <div
              key={q.id}
              className="query-item"
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease",
                cursor: "pointer",
              }}
              onClick={() => toggleQuery(q.id)}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h4 style={{ margin: 0, color: "#1e293b", fontWeight: 600, fontSize: "1.2rem" }}>
                  Q{q.id}. {q.question}
                </h4>
                {openQueryId === q.id ? <FaChevronUp /> : <FaChevronDown />}
              </div>

              <div
                style={{
                  overflow: "hidden",
                  transition: "all 0.3s ease",
                  height: openQueryId === q.id ? "auto" : 0,
                  marginTop: openQueryId === q.id ? "0.75rem" : 0,
                }}
              >
                <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1rem", margin: 0 }}>{q.answer}</p>
              </div>
            </div>
          ))}
        </div>
      </CardBox>
    </div>
  );
};

export default MyQueries;
