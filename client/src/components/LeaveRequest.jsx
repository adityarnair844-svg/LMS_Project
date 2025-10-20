import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/LeaveRequest.css";
import { format, isBefore, isSameDay, parseISO, isWeekend } from "date-fns";

const LeaveRequest = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [leaveTypes, setLeaveTypes] = useState([]);
  const [holidays, setHolidays] = useState([]);
  const [missingFields, setMissingFields] = useState([]); // track missing fields for visual hint

  const [form, setForm] = useState({
    leave_type_id: "",
    start_date: "",
    start_half: "",
    end_date: "",
    end_half: "",
    reason: "",
  });
  const [numDays, setNumDays] = useState(0);

  // --- Fetch Leave Types ---
  useEffect(() => {
    const fetchLeaveTypes = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/leave/leaveTypes"
        );
        setLeaveTypes(res.data);
      } catch (err) {
        console.error("Error fetching leave types:", err);
        toast.error("Failed to load leave types");
      }
    };
    fetchLeaveTypes();
  }, []);

  // --- Fetch Holidays ---
  useEffect(() => {
    const fetchHolidays = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/holidays");
        setHolidays(res.data || []);
      } catch (err) {
        console.error("Error fetching holidays:", err);
        toast.error("Failed to load holidays");
      }
    };
    fetchHolidays();
  }, []);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    // Auto adjust end date/session if needed
    if (name === "start_half") {
      if (value === "first_half" || value === "full_day") {
        updatedForm.end_date = updatedForm.start_date;
        updatedForm.end_half = value;
      }
    }

    setForm(updatedForm);
    // If user edits a field, remove it from missingFields (if present)
    setMissingFields((prev) => prev.filter((f) => f !== fieldLabel(name)));
  };

  // maps form keys to human readable labels used in missingFields
  const fieldLabel = (key) => {
    const map = {
      leave_type_id: "Leave Type",
      start_date: "From Date",
      start_half: "From Session",
      end_date: "To Date",
      end_half: "To Session",
      reason: "Reason",
    };
    return map[key] || key;
  };

  // --- Validation ---
  const validateForm = () => {
    const missing = [];
    if (!form.leave_type_id) missing.push("Leave Type");
    if (!form.start_date) missing.push("From Date");
    if (!form.start_half) missing.push("From Session");
    if (!form.end_date) missing.push("To Date");
    if (!form.end_half) missing.push("To Session");
    if (!form.reason || form.reason.trim() === "") missing.push("Reason");

    if (missing.length > 0) {
      const message = `Please fill in: ${missing.join(", ")}`;
      toast.warning(message);
      setMissingFields(missing);
      return false;
    }

    const start = new Date(form.start_date);
    const end = new Date(form.end_date);

    if (end < start) {
      toast.error("End Date cannot be before Start Date");
      return false;
    }

    if (
      form.start_date === form.end_date &&
      form.start_half !== form.end_half
    ) {
      toast.error("For the same date, From and To sessions must match");
      return false;
    }

    // clear any previous missing field markers
    setMissingFields([]);
    return true;
  };

  // --- Leave Duration Calculation ---
  useEffect(() => {
    if (form.start_date && form.end_date && form.start_half && form.end_half) {
      const start = new Date(form.start_date);
      const end = new Date(form.end_date);

      let days = (end - start) / (1000 * 3600 * 24);
      if (days < 0) {
        setNumDays(0);
        return;
      }

      if (form.start_date === form.end_date) {
        days = form.start_half === "full_day" ? 1 : 0.5;
      } else {
        if (form.start_half === "second_half") days -= 0.5;
        if (form.end_half === "first_half") days -= 0.5;
        days += 1;
      }
      setNumDays(days);
    } else {
      setNumDays(0);
    }
  }, [form.start_date, form.end_date, form.start_half, form.end_half]);

  // --- Submit Handler (clean, direct) ---
  // --- Submit Handler (fixed for leave balance issue) ---
const handleSubmit = async (status, e) => {
  if (e) e.preventDefault();
  if (!validateForm()) return;

  try {
    // Fetch employee-specific balance
    const balanceRes = await axios.get(
      `http://localhost:8800/api/leave/getLeaveBalance/${currentUser.employee_id}/${form.leave_type_id}`
    );
    const balance = Number(balanceRes.data.balanced_leaves ?? 0);

    if (balance < 0.5) {
      toast.warning("You have no available balance for this leave type.");
      return;
    }
    if (numDays > balance) {
      toast.warning(
        `Insufficient leave balance. You have only ${balance} day(s) available.`
      );
      return;
    }

    // --- Submit leave ---
    const res = await axios.post(
      "http://localhost:8800/api/leave/applyLeave",
      {
        ...form,
        status,
        employee_id: currentUser.employee_id,
        num_days: numDays,
      }
    );
    toast.success(res.data.message);
    setTimeout(() => navigate("/employee/leavedashboard"), 1200);
  } catch (err) {
    console.error(err);
    toast.error(err?.response?.data?.message || "Error submitting leave");
  }
};



  // --- Styling Helpers for date inputs ---
  const getDateStyle = (dateStr) => {
    if (!dateStr) return {};
    let date;
    try {
      date = parseISO(dateStr);
    } catch {
      return {};
    }
    const today = new Date();
    let style = {};

    if (isBefore(date, today)) {
      style.backgroundColor = "#f7f7f7";
      style.color = "#aaa";
    }

    if (isSameDay(date, today)) {
      style.border = "2px solid #4caf50";
      style.borderRadius = "4px";
    }

    if (isWeekend(date)) {
      style.color = "red";
      style.fontWeight = "600";
    }

    const holiday = holidays.find(
      (h) => h.holiday_date === format(date, "yyyy-MM-dd")
    );
    if (holiday) {
      style.backgroundColor =
        holiday.holiday_type === "FIXED" ? "#ffcccc" : "#ffd699";
    }

    return style;
  };

  const todayStr = format(new Date(), "yyyy-MM-dd");

  const inputStyleWithMissing = (fieldKey) => {
    const base = { ...styles.input };
    if (missingFields.includes(fieldLabel(fieldKey))) {
      return { ...base, border: "2px solid #e74c3c" };
    }
    return base;
  };

  return (
    <div style={styles.page} className="leave-request-page">
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <h1 style={styles.title}>Leave Request</h1>
      <form style={styles.form} onSubmit={(e) => e.preventDefault()}>
        {/* Leave Type */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Leave Type</label>
          <select
            name="leave_type_id"
            value={form.leave_type_id}
            onChange={handleChange}
            style={inputStyleWithMissing("leave_type_id")}
          >
            <option value="" disabled hidden>
              Select Leave Type
            </option>
            {leaveTypes
              .filter((lt) => lt.leave_type_name !== "Optional") // remove Optional
              .map((lt) => (
                <option key={lt.leave_type_id} value={lt.leave_type_id}>
                  {lt.leave_type_name}
                </option>
              ))}
          </select>
        </div>

        {/* From Date */}
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>From Date</label>
            <input
              type="date"
              name="start_date"
              value={form.start_date}
              onChange={handleChange}
              style={{
                ...inputStyleWithMissing("start_date"),
                ...getDateStyle(form.start_date),
              }}
              max={form.end_date || ""}
              placeholder="dd-mm-yyyy"
            />

            {missingFields.includes("From Date") && (
              <small style={styles.missingText}>
                Please choose a start date
              </small>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Session</label>
            <select
              name="start_half"
              value={form.start_half}
              onChange={handleChange}
              style={inputStyleWithMissing("start_half")}
            >
              <option value="" disabled hidden>
                Select
              </option>
              <option value="first_half">First Half</option>
              <option value="second_half">Second Half</option>
              <option value="full_day">Full Day</option>
            </select>
            {missingFields.includes("From Session") && (
              <small style={styles.missingText}>Please choose a session</small>
            )}
          </div>
        </div>

        {/* To Date */}
        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>To Date</label>
            <input
              type="date"
              name="end_date"
              value={form.end_date}
              onChange={handleChange}
              style={{
                ...inputStyleWithMissing("end_date"),
                ...getDateStyle(form.end_date),
              }}
              min={form.start_date || ""}
              placeholder="dd-mm-yyyy"
            />

            {missingFields.includes("To Date") && (
              <small style={styles.missingText}>
                Please choose an end date
              </small>
            )}
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Session</label>
            <select
              name="end_half"
              value={form.end_half}
              onChange={handleChange}
              style={inputStyleWithMissing("end_half")}
            >
              <option value="" disabled hidden>
                Select
              </option>
              <option value="first_half">First Half</option>
              <option value="second_half">Second Half</option>
              <option value="full_day">Full Day</option>
            </select>

            {missingFields.includes("To Session") && (
              <small style={styles.missingText}>Please choose a session</small>
            )}
          </div>
        </div>

        {/* Number of Days */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Days</label>
          <input
            type="text"
            value={numDays || ""}
            readOnly
            style={styles.input}
          />
        </div>

        {/* Reason */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Enter reason for leave..."
            style={{
              ...styles.textarea,
              ...(missingFields.includes("Reason")
                ? { border: "2px solid #e74c3c" }
                : {}),
            }}
          />
          {missingFields.includes("Reason") && (
            <small style={styles.missingText}>Please enter a reason</small>
          )}
        </div>

        {/* Buttons */}
        <div style={styles.actions}>
          <button
            type="button"
            className="button save"
            onClick={(e) => handleSubmit("Saved", e)}
          >
            Save
          </button>
          <button
            type="button"
            className="button submit"
            onClick={(e) => handleSubmit("Pending", e)}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Updated Styling ---
const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(to right, #e8f1f5, #f6fafc)", // light bluish-gray gradient for consistency
    padding: "50px 80px",
    fontFamily: "'Inter', sans-serif",
    color: "#222",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "28px",
    fontWeight: "700",
    color: "#1f3b4d",
    marginBottom: "30px",
    textAlign: "center", // centered heading
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    width: "100%", // full width form
    maxWidth: "100%", // allow stretch
    backgroundColor: "#ffffff",
    padding: "40px",
    borderRadius: "10px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.05)",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  label: {
    fontSize: "14px",
    marginBottom: "6px",
    fontWeight: "600",
    color: "#333",
  },
  input: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    outline: "none",
    background: "#fff",
  },
  select: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    background: "#fff",
    cursor: "pointer",
  },
  textarea: {
    padding: "10px 12px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px",
    resize: "vertical",
    background: "#fff",
    minHeight: "100px",
  },
  row: {
    display: "flex",
    gap: "20px",
    width: "100%",
  },
  actions: {
    marginTop: "12px",
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  missingText: {
    color: "#e74c3c",
    marginTop: "6px",
    fontSize: "12px",
  },
};

export default LeaveRequest;
