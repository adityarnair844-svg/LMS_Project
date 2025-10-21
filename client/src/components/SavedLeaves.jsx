import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaCheck, FaTrash } from "react-icons/fa";

const SavedLeaves = ({ onSuccess }) => {
    const { currentUser } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);

    // Fetch saved leaves
    const fetchLeaves = async () => {
        try {
            const res = await axios.get(`http://localhost:8800/api/leave/${currentUser.employee_id}/saved`);
            setLeaves(res.data);
        } catch (err) {
            console.error("Error fetching saved leaves:", err);
            toast.error("Failed to fetch saved leaves");
        }
    };

    useEffect(() => {
        fetchLeaves();
    }, []);

    // Submit leave (change status to Pending)
    const handleSubmit = async (leave_application_id) => {
        try {
            await axios.post(`http://localhost:8800/api/leave/submitApplication`, {
                leave_application_id
            });
            toast.success("Leave submitted successfully");
            fetchLeaves();
            onSuccess();
        } catch (err) {
            console.error("Error submitting leave:", err);
            toast.error("Failed to submit leave");
        }
    };

    // Delete leave
    const handleDelete = async (leaveId) => {
        try {
            await axios.delete(`http://localhost:8800/api/leave/deleteApplication/${leaveId}`);
            toast.success("Leave deleted successfully");
            fetchLeaves();
            onSuccess();
        } catch (err) {
            console.error("Error deleting leave:", err);
            toast.error("Failed to delete leave");
        }
    };


    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
    };
    const renderDays = (days) => {
        if (days == 1) return days + " day";
        if (days == 0.5) return "half day";
        return days + " days";
    };


    return (
        <div style={styles.page}>
            <h4 style={styles.title}>Pending for Submission (Leave Request)</h4>

            <div style={styles.tableWrapper}>
                <table style={styles.table}>
                    {leaves.length > 0 ? (
                        <thead>
                            <tr style={{ backgroundColor: "rgb(2, 91, 91)" }}>
                                <th style={{ ...styles.td, color: "#fff" }}>
                                    Req. ID
                                </th>
                                <th style={{ ...styles.td, color: "#fff" }}>
                                    Leave Type
                                </th>
                                <th style={{ ...styles.td, color: "#fff" }}>
                                    Leave Period
                                </th>
                                <th style={{ ...styles.td, color: "#fff" }}>
                                    No. of days
                                </th>
                                <th style={{ ...styles.td, color: "#fff" }}>
                                    Actions
                                </th>
                            </tr>
                        </thead>
                    ) : (<></>)
                    }
                    <tbody>
                        {leaves.length > 0 ? (
                            leaves.map((leave, index) => (

                                <tr
                                    key={leave.leave_application_id}
                                    style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                                >
                                    <td style={styles.td}>{leave.leave_application_id}</td>
                                    <td style={styles.td}>{leave.leave_type_name}</td>

                                    <td style={styles.td}>
                                        {formatDate(leave.start_date)} - {formatDate(leave.end_date)}
                                    </td>
                                    <td style={styles.td}>
                                        {renderDays(leave.no_of_days)}
                                    </td>
                                    <td style={{ ...styles.td, display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <button
                                            style={styles.actionButton}
                                            onClick={() => handleSubmit(leave.leave_application_id)}
                                        >
                                            <FaCheck style={{ color: "green" }} />
                                        </button>
                                        <button
                                            style={{ ...styles.actionButton, marginLeft: "8px" }}
                                            onClick={() => handleDelete(leave.leave_application_id)}
                                        >
                                            <FaTrash style={{ color: "red" }} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: "center", padding: "20px" }}>
                                    No saved leaves
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const styles = {
    page: {
        width: "100%",
        // minHeight: "100vh",
        background: "#f5f6fa",
        padding: "40px 30px",
        fontFamily: "'Inter', sans-serif",
        color: "#222",
        display: "flex",
        flexDirection: "column",
        // alignItems: "center",
    },
    title: {
        marginBottom: "20px",
        fontSize: "22px",
        fontFamily: "serif",
        // fontWeight: "600",
        color: "#333",
    },
    tableWrapper: {
        width: "100%",
        // maxWidth: "900px",
        background: "#fff",
        borderRadius: "10px",
        overflow: "hidden",
        boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    rowEven: {
        background: "#fff",
    },
    rowOdd: {
        background: "#f9f9f9",
    },
    td: {
        padding: "12px 15px",
        border: "1px solid #e0e0e0",
        fontSize: "13px",
        color: "#666",
        fontFamily: "serif",
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.02)",
    },
    actionButton: {
        cursor: "pointer",
        padding: "5px 10px",
        borderRadius: "6px",
        // border: "1px solid #ccc",
        fontSize: "14px",
        backgroundColor: "#fff",
        color: "#333",
        transition: "0.2s",
        marginRight: "8px",
    },
};

export default SavedLeaves;
