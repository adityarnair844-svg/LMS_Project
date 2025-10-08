import { useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const EditEmployeeSearchModal = ({ onFound, onClose }) => {
  const [employeeId, setEmployeeId] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [foundEmployee, setFoundEmployee] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("");
    setFoundEmployee(null);
    setShowEditForm(false);
    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:8800/api/employee/${employeeId}`,
        { withCredentials: true }
      );
      const emp = res.data;
      if (!emp || !emp.employee_id) {
        setError("Employee not found.");
        setLoading(false);
        return;
      }
      if (emp.role === "ADMIN") {
        setError("You cannot edit admin details.");
        setLoading(false);
        return;
      }
      if (emp.status === "INACTIVE") {
        setError("Employee no longer exists.");
        setLoading(false);
        return;
      }
      // ACTIVE and not admin
      setLoading(false);
      setFoundEmployee(emp);
    } catch (err) {
      setError("Employee not found.");
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-backdrop"
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
        className="modal"
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
        <h2 style={{ marginBottom: 20, color: "#007bff" }}>Edit Employee</h2>
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
            className="button-teal"
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

        {/* Show employee summary with edit icon if found and not editing */}
        {foundEmployee && !showEditForm && (
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
              alignItems: "flex-start",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", width: "100%" }}
            >
              <span style={{ fontWeight: 600, fontSize: 18, flex: 1 }}>
                {foundEmployee.first_name} {foundEmployee.last_name} (ID:{" "}
                {foundEmployee.employee_id})
              </span>
              <button
              className="button-teal"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  marginLeft: 8,
                }}
                title="Edit"
                onClick={() => {
                  setShowEditForm(true); // shows the form
                  onFound(foundEmployee); // notify parent to show edit form
                }}
              >
                <FaEdit color="#007bff" size={22} />
              </button>
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
            <div>
              <b>Phone:</b> {foundEmployee.phone_no}
            </div>
            <div>
              <b>Role:</b> {foundEmployee.role}
            </div>
          </div>
        )}

        {/* Show edit form if requested */}
        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button
            className="btn delete"
            onClick={onClose}
            style={{ minWidth: 100 }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditEmployeeSearchModal;
