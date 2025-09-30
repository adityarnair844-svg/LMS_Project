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
    <div className="modal-backdrop">
      <div
        className="modal"
        style={{
          background: "#fff",
          color: "#000",
          zIndex: 2000,
          position: "relative",
          minHeight: 300,
          minWidth: 400,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
        }}
      >
        <h2 style={{ marginBottom: 20, color: "#007bff" }}>Add Employee</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "18px",
              marginBottom: "18px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="employee_id"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Employee ID
              </label>
              <input
                id="employee_id"
                type="text"
                name="employee_id"
                onChange={handleChange}
                required
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="first_name"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                First Name
              </label>
              <input
                id="first_name"
                type="text"
                name="first_name"
                onChange={handleChange}
                required
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="last_name"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Last Name
              </label>
              <input
                id="last_name"
                type="text"
                name="last_name"
                onChange={handleChange}
                required
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="designation"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Designation
              </label>
              <input
                id="designation"
                type="text"
                name="designation"
                onChange={handleChange}
                required
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="email"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                name="email"
                onChange={handleChange}
                required
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="department"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Department
              </label>
              <input
                id="department"
                type="text"
                name="department"
                onChange={handleChange}
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="phone_no"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Phone Number
              </label>
              <input
                id="phone_no"
                type="text"
                name="phone_no"
                onChange={handleChange}
                required
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="manager_id"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Manager ID (optional)
              </label>
              <input
                id="manager_id"
                type="text"
                name="manager_id"
                onChange={handleChange}
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="password"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                name="password"
                onChange={handleChange}
                required
                style={{
                  width: "220px",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label
                htmlFor="role"
                style={{ fontWeight: 500, marginBottom: 4 }}
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                style={{
                  width: "220px",
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
