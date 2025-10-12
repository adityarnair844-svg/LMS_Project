import { useState } from "react";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";

const EditEmployeeForm = ({ employee, onSave, onCancel, showBack, onBack  }) => {
  // Debug: log received employee prop
  console.log("EditEmployeeForm received employee:", employee);
  if (!employee || !employee.employee_id) return null;

  const [formData, setFormData] = useState({
    ...employee,
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Remove password from formData if present
  delete formData.password;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await axios.put(
        `http://localhost:8800/api/employee/${employee.employee_id}`,
        formData,
        { withCredentials: true }
      );
      setMsg("Employee updated successfully");
      setLoading(false);
      onSave();
    } catch (err) {
      setLoading(false);
      setMsg(err.response?.data || "Error occurred");
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
        zIndex: 2000,
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
          minHeight: 480,
          maxHeight: 80 * 6 + 80,
          width: "100%",
          padding: "32px 40px 24px 40px",
          boxShadow: "0 10px 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
          position: "relative",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            marginBottom: 20,
            gap: 12,
          }}
        >
          {showBack && (
            <button
              type="button"
              onClick={onBack}
              
              style={{
                background: "white", // teal
                border: "none",
                color: "grey",
                fontWeight: 600,
                fontSize: 20,
                borderRadius: 6,
                padding: "6px 13px",
                marginRight: 8,
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.color = "#5ee6e6")}
              onMouseOut={(e) => (e.target.style.color = "grey")}
            >
               <FaArrowLeft /> 
            </button>
          )}
          <h2 style={{ margin: 0, color: "#007bff", flex: 1 }}>
            Edit Employee
          </h2>
        </div>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "18px 24px",
              marginBottom: "18px",
            }}
          >
            {/* Employee ID (read-only) */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="employee_id">Employee ID</label>
              <input
                id="employee_id"
                type="text"
                name="employee_id"
                value={formData.employee_id}
                readOnly
                style={{ background: "#f5f5f5", color: "#888" }}
              />
            </div>
            {/* First Name */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="first_name">
                First Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Last Name */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="last_name">
                Last Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
              />
            </div>
            {/* Designation */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="designation">
                Designation <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="designation"
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
              />
            </div>
            {/* Email */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="email">
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            {/* Department */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="department">
                Department <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="department"
                type="text"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              />
            </div>
            {/* Phone Number */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="phone_no">
                Phone Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="phone_no"
                type="text"
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
                required
              />
            </div>
            {/* Manager ID */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="manager_id">Manager ID</label>
              <input
                id="manager_id"
                type="text"
                name="manager_id"
                value={formData.manager_id}
                onChange={handleChange}
              />
            </div>
            {/* Role */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="role">
                Role <span style={{ color: "red" }}>*</span>
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  maxWidth: 180,
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                  background: "#f8f9fa",
                  color: "#333",
                  appearance: "menulist",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.04)",
                }}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>
          </div>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "16px" }}
          >
            <button
              type="submit"
              disabled={loading}
              className="button-teal"
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
              }}
              onMouseOver={(e) => (e.target.style.background = "#3399ff")}
              onMouseOut={(e) => (e.target.style.background = "#007bff")}
            >
              {loading ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="button-teal"
              style={{
                background: "#dc3545",
                color: "#fff",
                border: "none",
                padding: "10px 24px",
                borderRadius: "6px",
                fontWeight: 600,
                fontSize: "16px",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
              onMouseOver={(e) => (e.target.style.background = "#ff6666")}
              onMouseOut={(e) => (e.target.style.background = "#dc3545")}
            >
              Cancel
            </button>
          </div>
        </form>
        <p
          style={{
            marginTop: 10,
            textAlign: "center",
            color:
              msg && msg.toLowerCase().includes("success") ? "green" : "red",
          }}
        >
          {msg}
        </p>
      </div>
    </div>
  );
};

export default EditEmployeeForm;
