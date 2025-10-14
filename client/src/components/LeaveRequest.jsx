import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/LeaveRequest.css";

const LeaveRequest = () => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [leaveTypes, setLeaveTypes] = useState([]);
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
        const res = await axios.get("http://localhost:8800/api/leave/leaveTypes");
        setLeaveTypes(res.data);
      } catch (err) {
        console.error("Error fetching leave types:", err);
        toast.error("Failed to load leave types");
      }
    };
    fetchLeaveTypes();
  }, []);

  // --- Handle Input Changes ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedForm = { ...form, [name]: value };

    // Logic for auto date/session adjustment
    if (name === "start_half") {
      if (value === "first_half" || value === "full_day") {
        // Auto set to same date and disable end session
        updatedForm.end_date = updatedForm.start_date;
        updatedForm.end_half = value;
      }
    }

    setForm(updatedForm);
  };

  // --- Validation ---
  const validateForm = () => {
    const { start_date, end_date, start_half, end_half } = form;
    if (!form.leave_type_id || !start_date || !end_date || !start_half || !end_half || !form.reason) {
      toast.warning("Please fill in all fields");
      return false;
    }

    const start = new Date(start_date);
    const end = new Date(end_date);

    if (end < start) {
      toast.error("End Date cannot be before Start Date");
      return false;
    }

    if (start_date === end_date && start_half !== end_half) {
      toast.error("For the same date, From and To sessions must match");
      return false;
    }

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
        // Same-day logic
        days = form.start_half === "full_day" ? 1 : 0.5;
      } else {
        // Multi-day logic
        if (form.start_half === "second_half") days -= 0.5;
        if (form.end_half === "first_half") days -= 0.5;
        days += 1;
      }
      setNumDays(days);
    } else {
      setNumDays(0);
    }
  }, [form.start_date, form.end_date, form.start_half, form.end_half]);

  // --- Submit Handler ---
  const handleSubmit = (status) => async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await axios.post("http://localhost:8800/api/leave/applyLeave", {
        ...form,
        status,
        employee_id: currentUser.employee_id,
        num_days: numDays,
      });

      toast.success(`Leave ${status === "Saved" ? "Saved" : "Submitted"} successfully!`);
      setTimeout(() => navigate("/employee/leavedashboard"), 1500);
    } catch (err) {
      console.error("Error submitting leave:", err);
      toast.error("Something went wrong while submitting your leave");
    }
  };

  // --- Derived Behavior ---
  const isStartFirstHalf = form.start_half === "first_half";
  const isStartSecondHalf = form.start_half === "second_half";
  const isFullDay = form.start_half === "full_day";
  const sameDay = form.start_date === form.end_date;

  // --- To Date Disabled Logic ---
  const disableToDate = isStartFirstHalf;

  // --- To Session Disabled Logic ---
  const disableEndSession = sameDay || disableToDate;

  // --- Dynamic End Session Options ---
  const renderEndSessionOptions = () => {
    if (disableEndSession) {
      return (
        <>
          {form.start_half === "first_half" && <option value="first_half">First Half</option>}
          {form.start_half === "second_half" && <option value="second_half">Second Half</option>}
          {form.start_half === "full_day" && <option value="full_day">Full Day</option>}
        </>
      );
    } else {
      return (
        <>
          <option value="first_half">First Half</option>
          <option value="full_day">Full Day</option>
        </>
      );
    }
  };

  return (
    <div style={styles.page} className="leave-request-page">
      <h1 style={styles.title}>Leave Request</h1>
      <form style={styles.form}>
        {/* Leave Type */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Leave Type</label>
          <select
            name="leave_type_id"
            value={form.leave_type_id}
            onChange={handleChange}
            style={styles.select}
          >
            <option value="">Select Leave Type</option>
            {leaveTypes.map((lt) => (
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
              style={styles.input}
              max={form.end_date || ""}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Session</label>
            <select
              name="start_half"
              value={form.start_half}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="">Select</option>
              <option value="first_half">First Half</option>
              <option value="second_half">Second Half</option>
              <option value="full_day">Full Day</option>
            </select>
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
              style={styles.input}
              min={form.start_date || ""}
              disabled={disableToDate}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Session</label>
            <select
              name="end_half"
              value={form.end_half}
              onChange={handleChange}
              style={styles.select}
              disabled={disableEndSession}
            >
              <option value="">Select</option>
              {renderEndSessionOptions()}
            </select>
          </div>
        </div>

        {/* Number of Days */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Number of Days</label>
          <input type="text" value={numDays || ""} readOnly style={styles.input} />
        </div>

        {/* Reason */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Reason</label>
          <textarea
            name="reason"
            value={form.reason}
            onChange={handleChange}
            placeholder="Enter reason for leave..."
            style={styles.textarea}
          />
        </div>

        {/* Buttons */}
        <div style={styles.actions}>
          <button className="button save" onClick={handleSubmit("Saved")}>
            Save
          </button>
          <button className="button submit" onClick={handleSubmit("Pending")}>
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

// --- Styling ---
const styles = {
  page: {
    width: "100%",
    minHeight: "100vh",
    background: "linear-gradient(to bottom right, #f9fbfd, #eef3f7)",
    padding: "60px 100px",
    fontFamily: "'Inter', sans-serif",
    color: "#222",
  },
  title: {
    fontSize: "26px",
    fontWeight: "600",
    color: "#222",
    marginBottom: "40px",
    textAlign: "left",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "25px",
    width: "100%",
    maxWidth: "800px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
  },
  label: {
    fontSize: "15px",
    marginBottom: "8px",
    fontWeight: "500",
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
    marginTop: "20px",
    display: "flex",
    gap: "15px",
  },
};

export default LeaveRequest;
