import { useState } from "react";
import axios from "axios";

const EmployeeForm = ({ closeModal }) => {
  const [formData, setFormData] = useState({
    employee_id: "",
    first_name: "",
    last_name: "",
    designation: "",
    email: "",
    department: "",
    phone_no: "",
    manager_id: "",
    password: "",
    role: "EMPLOYEE",
  });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    console.log("Submitting employee form", formData);
    try {
      const res = await axios.post(
        "http://localhost:8800/api/employee/add",
        formData,
        { withCredentials: true }
      );
      console.log("Add employee success:", res);
      setMsg(res.data);
      setLoading(false);
      closeModal();
    } catch (err) {
      setLoading(false);
      if (err.response) {
        console.log(
          "Add employee error:",
          err.response.status,
          err.response.data
        );
      } else {
        console.log("Add employee error (no response):", err);
      }
      if (err.response?.status === 401) {
        window.location.href = "/login";
      } else {
        setMsg(err.response?.data || "Error occurred");
      }
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
          maxHeight: 80 * 6 + 80, // enough for all fields and buttons
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
        <h2 style={{ marginBottom: 20, color: "#007bff" }}>Add Employee</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "18px 24px",
              marginBottom: "18px",
            }}
          >
            {/* Employee ID */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="employee_id">
                Employee ID <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="employee_id"
                type="text"
                name="employee_id"
                value={formData.employee_id}
                onChange={handleChange}
                required
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
            {/* Manager ID (no star, not required) */}
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
            {/* Password */}
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label htmlFor="password">
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                id="password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
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
              {loading ? "Adding..." : "Add"}
            </button>
            <button
              type="button"
              onClick={closeModal}
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
              Close
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

export default EmployeeForm;
