import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { FaCheckCircle } from "react-icons/fa";
import { AuthContext } from "../context/authContext";
import "react-toastify/dist/ReactToastify.css";

const OptionalHoliday = () => {
  const { currentUser } = useContext(AuthContext);
  const [holidays, setHolidays] = useState([]);
  const [leaveDetails, setLeaveDetails] = useState({ balanced_leaves: 0, used_leaves: 0 });
  const [selectedHolidays, setSelectedHolidays] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    await Promise.all([
      fetchHolidays(),
      fetchAppliedOptionalLeaves(),
      fetchLeaveDetails(),
    ]);
  };

  const fetchHolidays = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/holidays");
      setHolidays(res.data);
    } catch (err) {
      console.error("Error fetching holidays:", err);
      toast.error("Failed to load holidays");
    }
  };

  const fetchAppliedOptionalLeaves = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/leave/appliedOptional/${currentUser.employee_id}`
      );
      if (res.data.success) {
        const applied = res.data.appliedLeaves.map((leave) => ({
          holiday_name: leave.leave_purpose,
          holiday_date: leave.start_date,
        }));
        setSelectedHolidays(applied);
      }
    } catch (err) {
      console.error("Error fetching applied optional leaves:", err);
      toast.error("Failed to load applied optional leaves");
    }
  };

  const fetchLeaveDetails = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8800/api/leave/getLeaveDetailsById/${currentUser.employee_id}`
      );
      const optionalLeaves = res.data.filter(
        (leave) => leave.leave_type_name === "Optional"
      );
      if (optionalLeaves.length > 0) {
        setLeaveDetails({
          balanced_leaves: optionalLeaves[0].balanced_leaves,
          used_leaves: optionalLeaves[0].used_leaves,
        });
      }
    } catch (err) {
      console.error("Error fetching leave details:", err);
      toast.error("Failed to load leave details");
    }
  };

  // ✅ Apply optional leave
  const handleSelectHoliday = async (holiday) => {
    if (loading) return; // prevent double-clicks
    setLoading(true);

    if (leaveDetails.balanced_leaves <= 0) {
      toast.warning("You have no optional leave balance available");
      setLoading(false);
      return;
    }

    const today = new Date();
    const holidayDate = new Date(holiday.holiday_date);
    today.setHours(0, 0, 0, 0);
    holidayDate.setHours(0, 0, 0, 0);
    if (holidayDate <= today) {
      toast.warning("Cannot apply leave on or after the holiday date");
      setLoading(false);
      return;
    }

    if (selectedHolidays.some((h) => h.holiday_date === holiday.holiday_date)) {
      toast.warning("You have already applied for this holiday");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`http://localhost:8800/api/leave/applyOptional`, {
        employee_id: currentUser.employee_id,
        holiday_date: holiday.holiday_date,
        holiday_name: holiday.holiday_name,
      });

      if (res.data.success) {
        toast.success(`Leave applied for ${holiday.holiday_name}`);
        await fetchAppliedOptionalLeaves();
        await fetchLeaveDetails();
      } else {
        toast.error(res.data.message || "Failed to apply leave");
      }
    } catch (err) {
      console.error("Error applying leave:", err);
      toast.error(err.response?.data?.message || "Failed to apply leave");
    }
    setLoading(false);
  };

  // ✅ Remove applied leave
  const handleRemoveSelection = async (holiday) => {
    if (loading) return;
    setLoading(true);
    try {
      const res = await axios.post(`http://localhost:8800/api/leave/removeOptional`, {
        employee_id: currentUser.employee_id,
        holiday_date: holiday.holiday_date,
      });

      if (res.data.success) {
        toast.info(`Leave removed for ${holiday.holiday_name}`);
        await fetchAppliedOptionalLeaves();
        await fetchLeaveDetails();
      } else {
        toast.error(res.data.message || "Failed to remove leave");
      }
    } catch (err) {
      console.error("Error removing leave:", err);
      toast.error(err.response?.data?.message || "Failed to remove leave");
    }
    setLoading(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Optional Leave Application</h2>
      <p>
        Balance Leaves:{" "}
        {Math.max(leaveDetails.balanced_leaves - selectedHolidays.length, 0)}
      </p>

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.headerRow}>
              <th style={styles.th}>#</th>
              <th style={styles.th}>Holiday Name</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Action</th>
            </tr>
          </thead>
          <tbody>
            {holidays.map((holiday, index) => {
              const isSelected = selectedHolidays.some(
                (h) => h.holiday_date === holiday.holiday_date
              );
              return (
                <tr
                  key={holiday.holiday_id}
                  style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}
                >
                  <td style={styles.td}>{holiday.holiday_id}</td>
                  <td style={styles.td}>{holiday.holiday_name}</td>
                  <td style={styles.td}>{holiday.holiday_date}</td>
                  <td style={styles.td}>{holiday.holiday_type}</td>
                  <td style={styles.td}>
                    {holiday.holiday_type === "OPTIONAL" ? (
                      isSelected ? (
                        <button
                          style={styles.removeBtn}
                          disabled={loading}
                          onClick={() => handleRemoveSelection(holiday)}
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          style={styles.applyBtn}
                          disabled={loading}
                          onClick={() => handleSelectHoliday(holiday)}
                        >
                          Apply <FaCheckCircle style={{ marginLeft: 5 }} />
                        </button>
                      )
                    ) : (
                      <span style={{ color: "#888" }}>Fixed</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          toastStyle={{ width: "400px", fontSize: "14px" }}
          pauseOnHover
          theme="light"
        />
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "40px",
    background: "#f9fafc",
    minHeight: "100vh",
    fontFamily: "'Inter', sans-serif",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    color: "#05445E",
    fontSize: "24px",
    fontWeight: "600",
  },
  tableWrapper: {
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 5px 20px rgba(0,0,0,0.1)",
    marginTop: "20px",
  },
  table: { width: "100%", borderCollapse: "collapse", background: "#fff" },
  headerRow: { backgroundColor: "#007b83", color: "#fff" },
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
  applyBtn: {
    background: "#52c41a",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  removeBtn: {
    background: "#f5222d",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default OptionalHoliday;
