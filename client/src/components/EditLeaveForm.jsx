import { useState, useEffect } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const EditLeaveForm = ({ closeModal, onSuccess, onError, selectedLeave }) => {
  const [formData, setFormData] = useState({
    leave_type_id: "",
    leave_type_name: "",
    no_of_leaves: 0,
    approval_type: "",
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedLeave) {
      setFormData({
        leave_type_id: selectedLeave.leave_type_id,
        leave_type_name: selectedLeave.leave_type_name,
        no_of_leaves: selectedLeave.no_of_leaves_per_year, // matches your DB field name
        approval_type: selectedLeave.approval_type,
      });
    }
  }, [selectedLeave]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      no_of_leaves: parseFloat(formData.no_of_leaves),
    };

    console.log("Submitting leave form", payload);

    try {
      const res = await axios.put(
        "http://localhost:8800/api/leave/updateLeaves",
        payload
      );
      console.log("Update leave success:", res);
      setLoading(false);
      closeModal();
      onSuccess();
    } catch (err) {
      setLoading(false);
      console.error("Update leave error:", err);
      onError();
    }
  };

  return (
    <div
      className=""
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
        className=""
        style={{
          background: "#fff",
          borderRadius: "16px",
          minWidth: 400,
          padding: "32px 40px",
          boxShadow: "0 10px 32px rgba(0,0,0,0.18)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <h2
            style={{
              margin: 0,
              color: "rgba(2, 91, 91, 0.91)",
              textAlign: "center",
              flex: 1,
            }}
          >
            Edit Leave Type
          </h2>
          <FaTimes
            style={{ cursor: "pointer", color: "#555", fontSize: "20px" }}
            onClick={closeModal}
            onMouseEnter={(e) => (e.target.style.color = "#dc3545")}
            onMouseLeave={(e) => (e.target.style.color = "#555")}
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "12px" }}
          >
            <label htmlFor="leave_type_id">Leave Type Id </label>
            <input
              type="text"
              name="leave_type_id"
              value={formData.leave_type_id}
              readOnly
              style={{ color: "#888" }}
            />

            <label>
              Leave Type Name
              <input
                type="text"
                name="leave_type_name"
                value={formData.leave_type_name}
                onChange={handleChange}
                required
              />
            </label>
            <label>
              Number of Leaves per Year
              <input
                type="number"
                name="no_of_leaves"
                value={formData.no_of_leaves}
                onChange={(e) => {
                  const val = e.target.value;
                  // Allow empty input for typing
                  if (val === "") {
                    setFormData((prev) => ({ ...prev, no_of_leaves: "" }));
                  } else {
                    const num = Number(val);
                    // Prevent negative values in state
                    setFormData((prev) => ({
                      ...prev,
                      no_of_leaves: num < 0 ? 0 : num,
                    }));
                  }
                }}
                onBlur={() => {
                  // If empty on blur, set to 0
                  if (formData.no_of_leaves === "") {
                    setFormData((prev) => ({ ...prev, no_of_leaves: 0 }));
                  }
                }}
                min={0} // prevents arrows from going negative
                required
              />
            </label>

            <label>
              Approval Type
              <input
                type="text"
                name="approval_type"
                value={formData.approval_type}
                onChange={handleChange}
                required
              />
            </label>
          </div>

          <div
            style={{
              marginTop: 20,
              display: "flex",
              gap: "12px",
              justifyContent: "center",
            }}
          >
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "rgba(2, 91, 91, 0.91)",
                color: "#fff",
                border: "none",
                padding: "10px 20px",
                borderRadius: "6px",
                cursor: "pointer",
              }}
              className="button-teal"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeaveForm;
