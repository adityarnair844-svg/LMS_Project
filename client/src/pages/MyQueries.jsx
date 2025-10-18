import React, { useContext } from "react";
import CardBox from "../components/CardBox";
import { AuthContext } from "../context/authContext";

const MyQueries = () => {
  const { currentUser } = useContext(AuthContext);

  // ✅ Base employee queries
  const baseEmployeeQueries = [
    {
      id: 1,
      question: "How can I apply for leave?",
      answer: "Go to the Leave section and fill in your leave request details."
    },
    {
      id: 2,
      question: "Who can approve my leave?",
      answer: "Your assigned manager will review and approve your leave request."
    },
    {
      id: 3,
      question: "How do I update my contact details?",
      answer: "Contact the admin via the Helpdesk section or email support."
    }
  ];

  // ✅ Manager additional queries
  const managerExtraQueries = [
    {
      id: 4,
      question: "How can I approve or reject leave requests?",
      answer: "Open the Leave Requests section in your dashboard and update the status."
    },
    {
      id: 5,
      question: "Can I view employees under another manager?",
      answer: "No, managers can only view and manage employees assigned to them."
    },
    {
      id: 6,
      question: "How do I submit announcements for my team?",
      answer: "Managers can send requests to the admin through the Helpdesk section."
    }
  ];

  // ✅ Updated Admin queries (focused on employee + leave type management)
  const adminQueries = [
    {
      id: 1,
      question: "How can I add a new employee?",
      answer: "Go to Employee Management → Add Employee and fill in the required details."
    },
    {
      id: 2,
      question: "How do I edit employee details or reset a password?",
      answer: "Use the Edit Employee option under Employee Management to update information or reset passwords."
    },
    {
      id: 3,
      question: "How do I remove an inactive employee?",
      answer: "Select Delete Employee from the Employee Management section and confirm the action."
    },
    {
      id: 4,
      question: "How can I add or modify leave types?",
      answer: "Use the Leave Type Management option in your admin panel to create or edit available leave types."
    },
    {
      id: 5,
      question: "Can I edit announcements after posting?",
      answer: "Yes, announcements can be edited or deleted directly from the Admin Dashboard."
    }
  ];

  // ✅ Determine role dynamically
  const role = currentUser?.designation?.toLowerCase().includes("admin")
    ? "admin"
    : currentUser?.designation?.toLowerCase().includes("manager")
    ? "manager"
    : "employee";

  // ✅ Combine queries based on role
  const displayedQueries =
    role === "admin"
      ? adminQueries
      : role === "manager"
      ? [...baseEmployeeQueries, ...managerExtraQueries]
      : baseEmployeeQueries;

  // ✅ UI
  return (
    <div className="my-queries" style={{ padding: "2rem" }}>
      <CardBox
        title="My Queries"
        icon="❓"
        className="shadow-lg rounded-2xl p-6"
      >
        <div className="queries-container">
          {displayedQueries.map((q) => (
            <div
              key={q.id}
              className="query-item"
              style={{
                backgroundColor: "#f9fafb",
                borderRadius: "12px",
                padding: "1.2rem 1.5rem",
                marginBottom: "1rem",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 4px 10px rgba(0,0,0,0.15)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.boxShadow =
                  "0 2px 4px rgba(0,0,0,0.05)")
              }
            >
              <h4
                style={{
                  marginBottom: "0.5rem",
                  color: "#1e293b",
                  fontWeight: "600",
                  fontSize: "1.05rem"
                }}
              >
                Q{q.id}. {q.question}
              </h4>
              <p
                style={{
                  color: "#475569",
                  lineHeight: "1.6",
                  fontSize: "0.95rem"
                }}
              >
                {q.answer}
              </p>
            </div>
          ))}
        </div>
      </CardBox>
    </div>
  );
};

export default MyQueries;
