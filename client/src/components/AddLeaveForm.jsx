import { useState } from "react";
import axios from "axios";
import { FaTimes } from "react-icons/fa";

const AddLeaveForm = ({ closeModal, onSuccess }) => {
    const [formData, setFormData] = useState({
        leave_type_id: "",
        leave_type_name: "",
        no_of_leaves: 0,
        approval_type: "",
    });

    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        console.log("Submitting leave form", formData);

        try {
            const res = await axios.post("http://localhost:8800/api/leave/addLeaves", formData);
            console.log("Add leave success:", res);
            setMsg("Leave added successfully!");
            setLoading(false);
            onSuccess(msg);
            closeModal();
        } catch (err) {
            setLoading(false);
            console.error("Add leave error:", err);
            setMsg("Error adding leave.");
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
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 20
                }}>
                    <h2 style={{ margin: 0, color: "rgba(2, 91, 91, 0.91)", textAlign: 'center', flex: 1 }}>Add Leave Type</h2>
                    <FaTimes style={{ cursor: 'pointer', color: '#555', fontSize: '20px' }} onClick={closeModal}
                        onMouseEnter={(e) => e.target.style.color = '#dc3545'}
                        onMouseLeave={(e) => e.target.style.color = '#555'}
                    />
                </div>
                <form onSubmit={handleSubmit}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <label>
                            Leave Type Id *
                            <input
                                type="text"
                                name="leave_type_id"
                                value={formData.leave_type_id}
                                onChange={handleChange}
                                required
                            />
                        </label>
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
                                onChange={handleChange}
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

                    <div style={{ marginTop: 20, display: "flex", gap: "12px", justifyContent: "center" }}>
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                background: "rgba(2, 91, 91, 0.91)",
                                color: "#fff",
                                border: "none",
                                padding: "10px 20px",
                                borderRadius: "6px",
                                cursor: "pointer"
                            }}
                            className="button-teal"
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>
                    </div>
                </form>
                {msg && (
                    <p style={{ marginTop: 10, textAlign: "center", color: msg.includes("success") ? "green" : "red" }}>
                        {msg}
                    </p>
                )}
            </div>
        </div>
    );
};

export default AddLeaveForm;
