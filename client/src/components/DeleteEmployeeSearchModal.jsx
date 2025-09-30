import { useState } from "react";
import axios from "axios";
import { FaTrash } from "react-icons/fa";

const DeleteEmployeeSearchModal = ({ onClose }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setFoundEmployee(null);
    setConfirmDelete(false);
    setLoading(true);

    try {
      const res = await axios.get(`http://localhost:8800/api/employee/${employeeId}`, {
        withCredentials: true,
      });
      const emp = res.data;

      if (!emp || !emp.employee_id) {
        setError("Employee not found.");
        setLoading(false);
        return;
      }
      if (emp.role === "ADMIN") {
        setError("You cannot delete admin.");
        setLoading(false);
        return;
      }
      if (emp.status !== "ACTIVE") {
        setError("Employee is already inactive.");
        setLoading(false);
        return;
      }
      setFoundEmployee(emp);
      setLoading(false);
    } catch (err) {
      setError("Employee not found.");
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/employee/${employeeId}`, {
        withCredentials: true,
      });
      alert("Employee deleted successfully");
      setFoundEmployee(null);
      setConfirmDelete(false);
      setEmployeeId("");
      onClose();
    } catch (err) {
      setError("Failed to delete employee");
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.15)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
       style={{
          background: "#fff",
          color: "#000",
          borderRadius: "16px",
          minWidth: 400,
          maxWidth: 560,
          minHeight: 240,
          maxHeight: 400,
          width: "100%",
          padding: "32px 40px 24px 40px",
          boxShadow: "0 10px 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          overflowY: "auto",
          zIndex: 10000,
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#007bff" }}>Delete Employee</h2>

        
          <form
            onSubmit={handleSearch}
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
           <input
            type="text"
            placeholder="Enter Employee ID"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            style={{
              padding: 10,
              fontSize: 16,
              borderRadius: 6,
              border: "1px solid #ccc",
              width: 220,
              maxWidth: 300,
            }}
            required
          />
            <button
              type="submit"
              disabled={loading || !employeeId}
              style={{
                background: "#007bff",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "16px",
                cursor: "pointer",
                transition: "background 0.2s",
                width: 120,
              }}
              onMouseOver={(e) => (e.target.style.background = "#66b3ff")}
            onMouseOut={(e) => (e.target.style.background = "#007bff")}
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </form>
        

         {(error || status) && (
          <div style={{ color: "red", marginTop: 16 }}>{error || status}</div>
        )}
        {foundEmployee && !confirmDelete && (
          <div
            style={{
              marginTop: 24,
              width: "100%",
              maxWidth: 400,
              background: "#f8f9fa",
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 20,
              display: "flex",
              flexDirection: "column",
              gap: 10,
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 18 }}>
              {foundEmployee.first_name} {foundEmployee.last_name} (ID: {foundEmployee.employee_id})
            </div>
            <div>
              <b>Email:</b> {foundEmployee.email}
            </div>
            <div>
              <b>Designation:</b> {foundEmployee.designation}
            </div>
            <div>
              <b>Department:</b> {foundEmployee.department}
            </div>
            <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
              <button
                onClick={() => setConfirmDelete(true)}
                style={{
                  background: "red",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                <FaTrash /> Delete
              </button>
              <button
                onClick={() => setFoundEmployee(null)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {confirmDelete && (
          <div style={{ marginTop: 24, width: "100%", maxWidth: 400 }}>
            <p>Are you sure you want to delete {foundEmployee.first_name}?</p>
            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={handleDelete}
                style={{
                  background: "red",
                  color: "#fff",
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "none",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 6,
                  border: "1px solid #ccc",
                  cursor: "pointer",
                }}
              >
                No
              </button>
            </div>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: 6,
              border: "1px solid #ccc",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteEmployeeSearchModal;
