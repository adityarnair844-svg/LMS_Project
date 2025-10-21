import React, { useState } from "react";

const LeaveStatusTable = ({ status, leaves, onClose }) => {
    const [page, setPage] = useState(0);
    const perPage = 3;

    const sorted = [...leaves].sort(
        (a, b) => new Date(b.applied_date) - new Date(a.applied_date)
    );

    const visibleLeaves = sorted.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(sorted.length / perPage);

    const handleSwipe = (direction) => {
        if (direction === "left" && page > 0) setPage(page - 1);
        if (direction === "right" && page < totalPages - 1) setPage(page + 1);
    };

    const headings =
        status === "pending"
            ? ["Req ID", "Leave Type", "Leave Period", "No. of Days", "Purpose"]
            : ["Req ID", "Leave Type", "Leave Period", "No. of Days", "Status Note"];

    return (
        <div
            style={{
                marginTop: "20px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "12px",
                background: "#fafafa",
                position: "relative",
            }}
        >
            <h3 style={{ fontFamily: "serif" }}>
                {status === "pending"
                    ? "Pending for Approval"
                    : status === "approved"
                        ? "Approved Leaves"
                        : "Rejected Leaves"}
            </h3>

            <button
                onClick={onClose}
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    border: "none",
                    background: "transparent",
                    fontSize: "18px",
                    cursor: "pointer",
                }}
            >
                ✖
            </button>

            <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}>
                <thead>
                    <tr style={{ backgroundColor: "rgb(2, 91, 91)" }}>
                        {headings.map((h, idx) => (
                            <th
                                key={idx}
                                style={{
                                    ...styles.td,
                                    color: "#fff",
                                    borderBottom: "1px solid #ccc",
                                    textAlign: "left",
                                    padding: "8px",
                                    fontFamily: "serif",
                                }}
                            >
                                {h}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ fontFamily: "serif" }}>
                    {visibleLeaves.map((l, i) => (
                        <tr key={i}>
                            <td style={styles.td}>{l.leave_application_id}</td>
                            <td style={styles.td}>{l.leave_type}</td>
                            <td style={styles.td}>{`${l.from_date} - ${l.to_date}`}</td>
                            <td style={styles.td}>{l.no_of_days}</td>
                            <td style={styles.td}>{status === "pending" ? l.purpose : l.status_note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Dots for swipe navigation */}
            <div style={{ textAlign: "center", marginTop: "8px" }}>
                {Array.from({ length: totalPages }).map((_, i) => (
                    <span
                        key={i}
                        onClick={() => setPage(i)}
                        style={{
                            height: "10px",
                            width: "10px",
                            margin: "3px",
                            display: "inline-block",
                            borderRadius: "50%",
                            backgroundColor: i === page ? "#333" : "#bbb",
                            cursor: "pointer",
                        }}
                    />
                ))}
            </div>

            {/* Swipe buttons (optional for desktop) */}
            <div style={{ textAlign: "center", marginTop: "10px", fontFamily: "serif" }}>
                <button
                    onClick={() => handleSwipe("left")}
                    disabled={page === 0}
                    style={{
                        ...buttonStyle,
                        ...(page === 0 ? disabledButtonStyle : {}),
                    }}
                >
                    ⬅ Prev
                </button>

                <button
                    onClick={() => handleSwipe("right")}
                    disabled={page >= totalPages - 1}
                    style={{
                        ...buttonStyle,
                        marginLeft: "10px",
                        ...(page >= totalPages - 1 ? disabledButtonStyle : {}),
                    }}
                >
                    Next ➡
                </button>
            </div>

        </div>
    );
};

export default LeaveStatusTable;

const styles = {
    td: {
        padding: "12px 15px",
        border: "1px solid #e0e0e0",
        fontSize: "13px",
        color: "#666",
        fontFamily: "serif",
        boxShadow: "inset 0 0 5px rgba(0,0,0,0.02)",
    }
}

const buttonStyle = {
  backgroundColor: "rgb(2, 91, 91)",
  color: "white",
  border: "none",
  borderRadius: "6px",
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "14px",
  transition: "opacity 0.3s, background 0.3s",
};

const disabledButtonStyle = {
  backgroundColor: "#ccc",
  color: "#666",
  cursor: "not-allowed",
  opacity: 0.6,
};
