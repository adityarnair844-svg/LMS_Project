import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaSave, FaCalendarCheck } from "react-icons/fa";

const AdminHoliday = () => {
  const [holidays, setHolidays] = useState([]);
  const [editRow, setEditRow] = useState(null);
  const [editedHoliday, setEditedHoliday] = useState({});
  const [isPublished, setIsPublished] = useState(false);

  useEffect(() => {
    fetchHolidays();
  }, []);

  const fetchHolidays = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/holidays");
      setHolidays(res.data);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      toast.error("Failed to load holidays");
    }
  };

  const handleEdit = (holiday) => {
    setEditRow(holiday.holiday_id);
    setEditedHoliday({ ...holiday });
  };

  const handleChange = (field, value) => {
    setEditedHoliday((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (id) => {
    try {
      await axios.put(`http://localhost:8800/api/holidays/${id}`, editedHoliday);
      toast.success("Holiday updated successfully");
      setEditRow(null);
      fetchHolidays();
    } catch (err) {
      console.error("Error updating holiday:", err);
      toast.error("Failed to update holiday");
    }
  };

  const handlePublish = async () => {
    try {
      await axios.post("http://localhost:8800/api/holidays/publish");
      toast.success("All holidays published successfully!");
      setIsPublished(true);
    } catch (err) {
      console.error("Error publishing holidays:", err);
      toast.error("Failed to publish holidays");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Holiday Management</h2>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Holiday Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday, index) => (
              <tr key={holiday.holiday_id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{holiday.holiday_id}</td>
                <td style={styles.td}>
                  {editRow === holiday.holiday_id ? (
                    <input
                      type="text"
                      value={editedHoliday.holiday_name}
                      onChange={(e) => handleChange("holiday_name", e.target.value)}
                      style={styles.input}
                    />
                  ) : (
                    holiday.holiday_name
                  )}
                </td>
                <td style={styles.td}>
                  {editRow === holiday.holiday_id ? (
                    <input
                      type="date"
                      value={editedHoliday.holiday_date}
                      onChange={(e) => handleChange("holiday_date", e.target.value)}
                      style={styles.input}
                    />
                  ) : (
                    new Date(holiday.holiday_date).toLocaleDateString("en-GB")
                  )}
                </td>
                <td style={styles.td}>
                  {editRow === holiday.holiday_id ? (
                    <select
                      value={editedHoliday.holiday_type}
                      onChange={(e) => handleChange("holiday_type", e.target.value)}
                      style={styles.input}
                    >
                      <option value="FIXED">Fixed</option>
                      <option value="OPTIONAL">Optional</option>
                    </select>
                  ) : (
                    holiday.holiday_type
                  )}
                </td>
                <td style={styles.td}>
                  {editRow === holiday.holiday_id ? (
                    <button style={styles.iconButton} onClick={() => handleSave(holiday.holiday_id)}>
                      <FaSave />
                    </button>
                  ) : (
                    <button style={styles.iconButton} onClick={() => handleEdit(holiday)}>
                      <FaEdit />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handlePublish}
        style={{
          ...styles.publishButton,
          backgroundColor: isPublished ? "#ccc" : "#007b83",
          cursor: isPublished ? "not-allowed" : "pointer",
        }}
        disabled={isPublished}
      >
        <FaCalendarCheck style={{ marginRight: 8 }} />
        {isPublished ? "Published" : "Publish All"}
      </button>
    </div>
  );
};

// 🎨 Styling
const styles = {
  container: {
    padding: "40px",
    background: "#f9fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "25px",
    color: "#05445E",
    fontSize: "24px",
    fontWeight: "600",
  },
  tableWrapper: {
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#fff",
  },
  headerRow: {
    backgroundColor: "#007b83",
    color: "#fff",
  },
  th: {
    padding: "14px",
    textAlign: "left",
    fontWeight: "600",
    fontSize: "15px",
  },
  td: {
    padding: "12px 15px",
    borderBottom: "1px solid #eee",
    fontSize: "14px",
    color: "#333",
  },
  rowEven: { background: "#fff" },
  rowOdd: { background: "#f6f9fb" },
  input: {
    padding: "6px 8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "13px",
  },
  iconButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#007b83",
    fontSize: "18px",
    transition: "0.2s",
  },
  publishButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "30px auto 0",
    padding: "10px 30px",
    borderRadius: "8px",
    border: "none",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "500",
    transition: "0.3s",
  },
};

export default AdminHoliday;
