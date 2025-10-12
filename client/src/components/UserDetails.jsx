import { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const UserDetails = ({ employee, onSave, showBack, onBack }) => {
  if (!employee || !employee.employee_id) return null;

  const [formData] = useState({ ...employee });
  const [msg, setMsg] = useState("");

  // Remove password if present
  delete formData.password;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await axios.put(
        `http://localhost:8800/api/employee/${employee.employee_id}`,
        formData,
        { withCredentials: true }
      );
      setMsg("Employee updated successfully");
      onSave();
    } catch (err) {
      setMsg(err.response?.data || "Error occurred");
    }
  };

  const fields = [
    { label: "Employee ID", value: formData.employee_id },
    { label: "Full Name", value: `${formData.first_name || ""} ${formData.last_name || ""}` },
    { label: "Designation", value: formData.designation || "" },
    { label: "Department", value: formData.department || "" },
    { label: "Email", value: formData.email || "" },
    { label: "Phone Number", value: formData.phone_no || "" },
   
  ];

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
          maxHeight: 560,
          width: "100%",
          padding: "32px 40px 24px 40px",
          boxShadow: "0 10px 32px rgba(0,0,0,0.18)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          overflowY: "auto",
          position: "relative",
        }}
      >
       {/* Header */}
<div
  style={{
    display: "flex",
    alignItems: "center",
    width: "100%",
    marginBottom: 20,
    justifyContent: "center", // center heading
    position: "relative", // allows X button to be positioned
  }}
>
  <h2
    style={{
      margin: 0,
      color: "#007bff",
      textAlign: "center",
      flex: 1,
    }}
  >
    Details
  </h2>

  {showBack && (
    <button
      type="button"
      onClick={onBack}
      style={{
        background: "white",
        border: "none",
        color: "grey",
        fontWeight: 600,
        fontSize: 20,
        borderRadius: 6,
        padding: "6px 13px",
        cursor: "pointer",
        transition: "background 0.2s",
        position: "absolute",
        right: 0, // keep it top-right
      }}
      onMouseOver={(e) => (e.target.style.color = "red")}
      onMouseOut={(e) => (e.target.style.color = "grey")}
    >
      <FaTimes style={{ fontSize: 20 }} />
    </button>
  )}
</div>



        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "16px",
              marginBottom: 18,
            }}
          >
            {fields.map((field, idx) => (
              <div
                key={idx}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "6px 0",
                  borderBottom: "1px solid #eee",
                }}
              >
                <span style={{ fontWeight: 500, color: "#555" }}>{field.label}:</span>
                <span style={{ fontWeight: 400, color: "#000" }}>{field.value}</span>
              </div>
            ))}
          </div>
        </form>

        {msg && (
          <p
            style={{
              marginTop: 10,
              textAlign: "center",
              color: msg.toLowerCase().includes("success") ? "green" : "red",
            }}
          >
            {msg}
          </p>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
