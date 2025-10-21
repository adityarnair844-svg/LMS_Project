import { db } from "../db.js";

export const getLeaveTypes = async (req, res) => {
  const query = `
    SELECT * FROM leave_type;
  `;
  db.query(query, (err, data) => {
    if (err) return res.status(500).json("Database error: " + err.message);
    // console.log("Error:", err, "Data:", data);
    if (!data || data.length === 0) {
      console.log("No leaves found");
      return res.status(200).json("No leaves found.");
    }
    return res.status(200).json(data);
  });
};

export const addLeaves = async (req, res) => {
  const { leave_type_id, approval_type, leave_type_name, no_of_leaves } = req.body;
  const query =
    "INSERT INTO leave_type (leave_type_id, approval_type, leave_type_name, no_of_leaves_per_year) VALUES (?, ?, ?, ?)";
  //   console.log("Inserting this table");
  db.query(
    query,
    [leave_type_id, approval_type, leave_type_name, no_of_leaves],
    (err, data) => {
      if (err) {
        console.log("Error:", err, "Data:", data);
        return res.status(500).json("Error inserting Leaves");
      }
      console.log("Error:", err, "Data:", data);
      return res.status(201).json("Employee added successfully!");
    }
  );


};

export const validateDelete = async (req, res) => {
  const { leave_type_id } = req.params;
  const query =
    "SELECT COUNT(*) AS count FROM leave_details WHERE leave_type_id = ?";
  console.log("Searching");
  db.query(query, [leave_type_id], (err, data) => {
    if (err) {
      console.error("DB Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }

    const count = data[0].count;
    console.log("Count", count);

    if (count > 0) {
      console.log("Cannot Delete");
      return res.status(200).json({
        canDelete: false,
        message:
          "This leave type is assigned to employees and cannot be deleted.",
      });
    } else {
      console.log("Can Delete");
      return res.status(200).json({
        canDelete: true,
        message: "This leave type can be safely deleted.",
      });
    }
  });
};

export const syncLeaveForEmployees = async (req, res) => {
  const { leave_type_id } = req.params;

  // Check if leave_type_id exists in leave_type table
  const checkLeaveType = "SELECT * FROM leave_type WHERE leave_type_id = ?";
  db.query(checkLeaveType, [leave_type_id], (err, leaveData) => {
    if (err) return res.status(500).json({ message: "DB error: " + err.message });
    if (!leaveData || leaveData.length === 0) return res.status(404).json({ message: "Leave type not found" });

    const no_of_leaves_per_year = leaveData[0].no_of_leaves_per_year;

    // 1️⃣ Insert missing leave_details rows for employees
    const insertQuery = `
      INSERT INTO leave_details (employee_id, leave_type_id, balanced_leaves, used_leaves)
      SELECT e.employee_id, lt.leave_type_id, lt.no_of_leaves_per_year, 0
      FROM employee e
      CROSS JOIN leave_type lt
      WHERE lt.leave_type_id = ?
      AND NOT EXISTS (
        SELECT 1 FROM leave_details ld
        WHERE ld.employee_id = e.employee_id
          AND ld.leave_type_id = lt.leave_type_id
      );
    `;

    db.query(insertQuery, [leave_type_id], (err2, insertRes) => {
      if (err2) return res.status(500).json({ message: "DB error: " + err2.message });

      const addedRows = insertRes?.affectedRows ?? 0;

      // 2️⃣ Update existing leave_details for employees
      // balanced_leaves = max(no_of_leaves_per_year - used_leaves, 0)
      const updateQuery = `
        UPDATE leave_details ld
        JOIN leave_type lt ON ld.leave_type_id = lt.leave_type_id
        SET ld.balanced_leaves = GREATEST(lt.no_of_leaves_per_year - ld.used_leaves, 0)
        WHERE lt.leave_type_id = ?;
      `;

      db.query(updateQuery, [leave_type_id], (err3, updateRes) => {
        if (err3) return res.status(500).json({ message: "DB error: " + err3.message });

        const updatedRows = updateRes?.affectedRows ?? 0;

        return res.status(200).json({
          message: "Leave synced successfully. Balances updated safely for all employees.",
          addedRows,
          updatedRows,
        });
      });
    });
  });
};

// GET /api/leave/balance/:employee_id/:leave_type_id
export const getLeaveBalance = (req, res) => {
  const { employee_id, leave_type_id } = req.params;
  const query = `
    SELECT balanced_leaves 
    FROM leave_details 
    WHERE employee_id = ? AND leave_type_id = ?
  `;
  db.query(query, [employee_id, leave_type_id], (err, data) => {
    if (err) return res.status(500).json({ message: err.message });
    if (!data || data.length === 0)
      return res.status(404).json({ message: "Leave details not found" });

    res.status(200).json({ balanced_leaves: data[0].balanced_leaves });
  });
};


export const getLeaveDetailsById = async (req, res) => {
  const { employee_id } = req.params;
  const query = `SELECT 
    ld.leave_type_id,
    lt.leave_type_name,
    lt.approval_type,
    lt.no_of_leaves_per_year,
    ld.balanced_leaves,
    ld.used_leaves
FROM 
    leave_details ld
JOIN 
    leave_type lt 
    ON ld.leave_type_id = lt.leave_type_id
WHERE 
    ld.employee_id = ?;`;
  db.query(query, [employee_id], (err, data) => {
    if (err) return res.status(500).json("Database error: " + err.message);
    console.log("Error:", err, "Data:", data);
    if (!data || data.length === 0) {
      console.log("No leaves found");
      return res.status(200).json("No leaves found.");
    }
    return res.status(200).json(data);
  });
};

const generateLeaveApplicationId = async () => {
  return new Promise((resolve, reject) => {
    // Get the maximum numeric part used so far (substring from 3rd char onward)
    const maxQuery =
      "SELECT MAX(CAST(SUBSTRING(leave_application_id, 3) AS UNSIGNED)) AS maxId FROM leave_application";

    db.query(maxQuery, (err, rows) => {
      if (err) return reject(err);

      let nextNum = 1;
      if (rows && rows[0] && rows[0].maxId != null) {
        nextNum = parseInt(rows[0].maxId, 10) + 1;
      }

      const makeId = (n) => "LA" + String(n).padStart(4, "0");

      // Try generated id and if already exists, increment and retry (safety limit)
      const tryId = (n, attempts = 0) => {
        const id = makeId(n);
        const existsQuery =
          "SELECT 1 FROM leave_application WHERE leave_application_id = ? LIMIT 1";
        db.query(existsQuery, [id], (err2, existsRows) => {
          if (err2) return reject(err2);

          if (!existsRows || existsRows.length === 0) {
            // id is free
            return resolve(id);
          }

          // if exists, try next
          if (attempts >= 1000) {
            // safety: avoid infinite loop
            return reject(
              new Error(
                "Could not generate unique leave_application_id after many attempts"
              )
            );
          }
          tryId(n + 1, attempts + 1);
        });
      };

      tryId(nextNum);
    });
  });
};


export const applyLeave = async (req, res) => {
  try {
    console.log("➡️ applyLeave called with:", req.body);

    const {
      leave_type_id,
      start_date,
      start_half,
      end_date,
      end_half,
      reason,
      status,
      employee_id,
      num_days
    } = req.body;

    if (!leave_type_id || !start_date || !start_half || !end_date || !end_half || !reason || !status || !employee_id || num_days === undefined) {
      console.log("❌ Missing fields");
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave_application_id = await generateLeaveApplicationId();
    const applied_date = new Date().toISOString().slice(0, 10);

    console.log("✅ Generated leave_application_id:", leave_application_id);

    const statusQuery = `SELECT status_id FROM status WHERE status_name = ? LIMIT 1`;
    db.query(statusQuery, [status], (err, statusResult) => {
      if (err) {
        console.error("❌ DB error fetching status:", err);
        return res.status(500).json({ message: "DB error fetching status" });
      }
      if (statusResult.length === 0) {
        console.log("❌ Invalid status name:", status);
        return res.status(400).json({ message: "Invalid status" });
      }

      const status_id = statusResult[0].status_id;
      console.log("✅ status_id:", status_id);

      const insertQuery = `
        INSERT INTO leave_application
        (leave_application_id, leave_purpose, start_date, end_date, no_of_days, applied_date, 
         leave_type_id, status_id, employee_id, status_note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.query(
        insertQuery,
        [
          leave_application_id,
          reason,
          start_date,
          end_date,
          num_days,
          applied_date,
          leave_type_id,
          status_id,
          employee_id,
          null
        ],
        (err, data) => {
          if (err) {
            console.error("❌ Error inserting leave:", err);
            return res.status(500).json({ message: "Database error", error: err.message });
          }

          console.log("✅ Leave inserted:", data);
          return res.status(200).json({
            message: `Leave ${status === "Saved" ? "saved" : "submitted"} successfully`,
            leave_application_id,
            leave_days: num_days
          });
        }
      );
    });
  } catch (err) {
    console.error("🔥 Error applying leave:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const fetchSavedLeaves = async (req, res) => {
  const { employee_id } = req.params;
  const query = `
    SELECT la.leave_application_id, lt.leave_type_name, la.start_date, la.end_date, la.applied_date, la.no_of_days
    FROM leave_application la
    JOIN leave_type lt ON la.leave_type_id = lt.leave_type_id
    JOIN status s ON la.status_id = s.status_id
    WHERE la.employee_id = ? AND s.status_name = ?
  `;
  db.query(query, [employee_id, "Saved"], (err, data) => {
    console.log("Error:", err, "Data", data)
    if (err) return res.status(500).json({ message: err.message });
    return res.status(200).json(data);
  });
}


export const deleteLeaveApplication = async (req, res) => {
  try {
    const { leave_application_id } = req.params;

    if (!leave_application_id) {
      return res.status(400).json({ message: "Leave application ID is required" });
    }

    const deleteQuery = `DELETE FROM leave_application WHERE leave_application_id = ?`;

    db.query(deleteQuery, [leave_application_id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error: " + err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Leave application not found" });
      }

      return res.status(200).json({ message: "Leave deleted successfully" });
    });
  } catch (err) {
    console.error("Error deleting leave:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const submitLeaveApplication = async (req, res) => {
  try {
    const { leave_application_id } = req.body;

    if (!leave_application_id) {
      return res.status(400).json({ message: "Leave application ID is required" });
    }

    // Step 1️⃣: Fetch application details
    const getAppQuery = `
      SELECT la.leave_type_id, la.employee_id, la.no_of_days
      FROM leave_application la
      WHERE la.leave_application_id = ?
    `;

    db.query(getAppQuery, [leave_application_id], (err, result) => {
      if (err) return res.status(500).json({ message: "Database error: " + err.message });
      if (result.length === 0) return res.status(404).json({ message: "Leave application not found" });

      const { leave_type_id, employee_id, no_of_days } = result[0];

      // Step 2️⃣: Get status_id for "Pending"
      const statusQuery = `SELECT status_id FROM status WHERE status_name = 'Pending'`;

      db.query(statusQuery, (err, statusResult) => {
        if (err) return res.status(500).json({ message: "Error fetching status: " + err.message });
        if (statusResult.length === 0) return res.status(404).json({ message: "Pending status not found" });

        const status_id = statusResult[0].status_id;

        // Step 3️⃣: Calculate total leave days - not required due to logic change


        // Step 4️⃣: Update leave_application status
        const updateAppQuery = `
          UPDATE leave_application
          SET status_id = ?
          WHERE leave_application_id = ?
        `;

        db.query(updateAppQuery, [status_id, leave_application_id], (err, updateResult) => {
          if (err) return res.status(500).json({ message: "Error updating application: " + err.message });

          // Step 5️⃣: Update leave_details (balanced_leaves ↓, used_leaves ↑)
          const updateLeaveDetailsQuery = `
            UPDATE leave_details
            SET balanced_leaves = balanced_leaves - ?
            WHERE employee_id = ? AND leave_type_id = ?
          `;

          db.query(updateLeaveDetailsQuery, [no_of_days, employee_id, leave_type_id], (err, detailResult) => {
            if (err) return res.status(500).json({ message: "Error updating leave details: " + err.message });

            return res.status(200).json({
              message: "Leave submitted successfully",
              leave_application_id,
              no_of_days,
              new_status: "Pending",
            });
          });
        });
      });
    });
  } catch (err) {
    console.error("Error submitting leave:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAppliedLeaves = async (req, res) => {
  try {
    const { employee_id, leave_type_id } = req.params;

    // SQL to sum no_of_days for pending leaves
    const la_query = `
            SELECT COALESCE(SUM(no_of_days), 0) AS total_applied
            FROM leave_application
            WHERE employee_id = ? 
              AND leave_type_id = ? 
              AND status_id = (SELECT status_id FROM status WHERE status_name = 'Pending' LIMIT 1)
        `;

    db.query(la_query, [employee_id, leave_type_id], (err, data) => {
      if (err) {
        console.error("Error fetching applied leaves:", err);
        return res.status(500).json({ message: "Error fetching applied leaves: " + err.message });
      }
      console.log("Applied: ", data[0].total_applied)

      return res.status(200).json({
        appliedLeaves: data[0].total_applied,
        leave_type_id
      });
    });
  } catch (err) {
    console.error("Internal error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteLeaves = (req, res) => {
  const { leave_type_id } = req.params;

  // First check if leave type exists
  const checkQuery = "SELECT * FROM leave_type WHERE leave_type_id=? ";
  db.query(checkQuery, [leave_type_id], (err, data) => {
    if (err) return res.status(500).json("Database error: " + err.message);
    if (!data || data.length === 0)
      return res.status(404).json("Leave type not found.");

    // Delete from leave_type table
    const deleteLeaveTypeQuery = "DELETE FROM leave_type WHERE leave_type_id=?";
    db.query(deleteLeaveTypeQuery, [leave_type_id], (err1) => {
      if (err1)
        return res
          .status(500)
          .json("Error deleting leave type: " + err1.message);
      // Delete from leave_details
      const deleteLeaveDetailsQuery =
        "DELETE FROM leave_details WHERE leave_type_id=?";
      db.query(deleteLeaveDetailsQuery, [leave_type_id], (err3) => {
        if (err3)
          return res
            .status(500)
            .json("Error deleting leave details: " + err3.message);
        return res.status(200).json("Leave deleted successfully");
      });
    });
  });
};

export const updateLeaves = (req, res) => {
  const { leave_type_id, approval_type, leave_type_name, no_of_leaves } =
    req.body;

  // Only allow updating allowed fields
  const updateQuery = `UPDATE leave_type SET approval_type=?, leave_type_name=?, no_of_leaves_per_year=? WHERE leave_type_id=?`;


  db.query(
    updateQuery,
    [approval_type, leave_type_name, no_of_leaves, leave_type_id],
    (err, result) => {
      if (err) return res.status(500).json("Database error: " + err.message);
      else {
        return res.status(200).json("Leave details updated successfully");
      }
    }
  );
};

// GET /api/leave/summary/:employee_id
export const getLeaveSummary = (req, res) => {
  const { employee_id } = req.params;

  const query = `
    SELECT 
      s.status_name, 
      COUNT(*) AS count
    FROM leave_application la
    JOIN status s ON la.status_id = s.status_id
    WHERE la.employee_id = ?
    GROUP BY s.status_name
  `;

  db.query(query, [employee_id], (err, data) => {
    if (err) return res.status(500).json({ message: "DB error: " + err.message });

    const stats = { saved: 0, pending: 0, approved: 0, rejected: 0 };

    data.forEach(row => {
      const name = row.status_name.toLowerCase();
      if (name.includes("saved")) stats.saved = row.count;
      else if (name.includes("pending")) stats.pending = row.count;
      else if (name.includes("approved")) stats.approved = row.count;
      else if (name.includes("rejected")) stats.rejected = row.count;
    });

    res.status(200).json(stats);
  });
};

// GET /api/leave/pendingApprovals/:manager_id
export const getPendingApprovalCount = (req, res) => {
  const { manager_id } = req.params;

  const query = `
    SELECT COUNT(*) AS count
    FROM leave_application la
    JOIN employee e ON la.employee_id = e.employee_id
    JOIN status s ON la.status_id = s.status_id
    WHERE s.status_name = 'Pending'
    AND e.manager_id = ?;
  `;

  db.query(query, [manager_id], (err, data) => {
    if (err) return res.status(500).json({ message: "DB error: " + err.message });
    res.status(200).json({ count: data[0]?.count || 0 });
  });
};




// controller
export const getPendingApprovals = async (req, res) => {
  const { manager_id } = req.params;
  const query = `
    SELECT 
      la.leave_application_id,
      la.leave_purpose,
      la.start_date,
      la.end_date,
      la.no_of_days,
      la.applied_date,
      lt.leave_type_name,
      e.employee_id,
      CONCAT(e.first_name, ' ', e.last_name) AS employee_name,
      s.status_name
    FROM leave_application la
    JOIN employee e ON la.employee_id = e.employee_id
    JOIN leave_type lt ON la.leave_type_id = lt.leave_type_id
    JOIN status s ON la.status_id = s.status_id
    WHERE e.manager_id = ? AND s.status_name = 'Pending'
    ORDER BY la.applied_date DESC;
  `;

  db.query(query, [manager_id], (err, data) => {
    if (err) return res.status(500).json({ message: "Error fetching leaves", error: err });
    return res.status(200).json(data);
  });
};


export const updateLeaveStatus = async (req, res) => {
  const { leave_application_id, status_name, status_note } = req.body;

  try {
    // 1️⃣ Validate input
    if (!leave_application_id || !status_name) {
      return res.status(400).json({ message: "leave_application_id and status_name are required" });
    }

    // 2️⃣ Get status_id from status_name
    const getStatusIdQuery = "SELECT status_id FROM status WHERE status_name = ?";
    db.query(getStatusIdQuery, [status_name], (err, statusResult) => {
      if (err) return res.status(500).json({ message: "Database error fetching status_id", error: err });
      if (statusResult.length === 0) return res.status(400).json({ message: "Invalid status" });

      const status_id = statusResult[0].status_id;

      // 3️⃣ Update leave_application with new status
      const updateQuery = `
        UPDATE leave_application 
        SET status_id = ?, status_note = ? 
        WHERE leave_application_id = ?;
      `;
      db.query(updateQuery, [status_id, status_note, leave_application_id], (err2) => {
        if (err2) return res.status(500).json({ message: "Error updating leave_application", error: err2 });

        // 4️⃣ Fetch leave details to adjust balances if needed
        const fetchLeaveDetailsQuery = `
          SELECT la.no_of_days, la.employee_id, la.leave_type_id
          FROM leave_application la
          WHERE la.leave_application_id = ?;
        `;
        db.query(fetchLeaveDetailsQuery, [leave_application_id], (err3, leaveResult) => {
          if (err3) return res.status(500).json({ message: "Error fetching leave details", error: err3 });
          if (leaveResult.length === 0) return res.status(404).json({ message: "Leave application not found" });

          const { no_of_days, employee_id, leave_type_id } = leaveResult[0];

          // 5️⃣ Update leave_details based on status
          let balanceQuery = "";
          if (status_name == "Approved") {
            balanceQuery = `
              UPDATE leave_details
              SET used_leaves = used_leaves + ?
              WHERE employee_id = ? AND leave_type_id = ?;
            `;
          } else if (status_name == "Rejected") {
            balanceQuery = `
              UPDATE leave_details
              SET balanced_leaves = balanced_leaves + ?
              WHERE employee_id = ? AND leave_type_id = ?;
            `;
          }

          if (!balanceQuery) {
            // For statuses other than Approved/Rejected, just return success
            console.log("status Name:", status_name);
            return res.status(200).json({ message: "Status updated successfully (no balance change)" });

          }

          db.query(balanceQuery, [no_of_days, employee_id, leave_type_id], (err4, balanceResult) => {
            if (err4) {
              return res.status(500).json({ message: "Error updating leave balance", error: err4 });
            }

            return res.status(200).json({
              message: `Status updated successfully and leave balances adjusted for ${status_name}`,
            });
          });
        });
      });
    });
  } catch (error) {
    console.error("Error updating leave status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


// Fetch pending submissions for a specific employee
export const getPendingSubmissionsCount = (req, res) => {
  const { employee_id } = req.params;

  // Assuming status table has 'Pending Submission' as a valid status
  const query = `
    SELECT COUNT(*) AS count
    FROM leave_application la
    JOIN status s ON la.status_id = s.status_id
    WHERE la.employee_id = ? AND s.status_name = 'Saved';
  `;

  db.query(query, [employee_id], (err, result) => {
    if (err) {
      console.error("Error fetching pending submissions:", err);
      return res.status(500).json({ message: "Error fetching pending submissions" });
    }
    const count = result?.[0]?.count || 0;
    res.status(200).json({ count });
  });
};


export const calendar = (req, res) => {
  const { employee_id } = req.params;
  db.query(
    `SELECT l.leave_application_id, l.start_date, l.end_date,
              l.leave_purpose, s.status_name, t.leave_type_name
       FROM leave_application l
       JOIN status s ON l.status_id = s.status_id
       JOIN leave_type t ON l.leave_type_id = t.leave_type_id
       WHERE l.employee_id = ?`,
    [employee_id], (err, result) => {
      if (err) {
        console.error("Error fetching pending submissions:", err);
        return res.status(500).json({ message: "Error fetching calendar data" });
      }
      return res.status(200).json(result);
    }
  );

};


export const applyOptionalLeave = async (req, res) => {
  const { employee_id, holiday_date, holiday_name } = req.body;

  if (!employee_id || !holiday_date) {
    return res.status(400).json({ success: false, message: "Missing employee_id or holiday_date" });
  }

  try {
    // 1️⃣ Get leave_type_id for Optional leave
    const leaveTypeRows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT leave_type_id FROM leave_type WHERE leave_type_name = 'Optional'",
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (leaveTypeRows.length === 0)
      return res.status(404).json({ success: false, message: "Optional leave type not found" });

    const leave_type_id = leaveTypeRows[0].leave_type_id;

    // 2️⃣ Get leave_details for employee
    const leaveDetailsRows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM leave_details WHERE employee_id = ? AND leave_type_id = ?",
        [employee_id, leave_type_id],
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (leaveDetailsRows.length === 0)
      return res.status(404).json({ success: false, message: "Leave details not found for employee" });

    const leaveDetails = leaveDetailsRows[0];

    if (leaveDetails.balanced_leaves <= 0)
      return res.status(400).json({ success: false, message: "Insufficient leave balance" });

    // 3️⃣ Get status_id for 'Approved'
    const statusRows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT status_id FROM status WHERE status_name = 'Approved'",
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (statusRows.length === 0)
      return res.status(404).json({ success: false, message: "'Approved' status not found" });

    const status_id = statusRows[0].status_id;

    // 4️⃣ Generate leave_application_id
    const leave_application_id = await generateLeaveApplicationId();

    // 5️⃣ Insert into leave_application (auto-approved)
    await new Promise((resolve, reject) => {
      const insertQuery = `
        INSERT INTO leave_application
        (leave_application_id, leave_purpose, start_date, end_date, no_of_days, applied_date, leave_type_id, status_id, employee_id)
        VALUES (?, ?, ?, ?, ?, CURDATE(), ?, ?, ?)`;

      db.query(
        insertQuery,
        [leave_application_id, holiday_name || "Optional Holiday", holiday_date, holiday_date, 1.0, leave_type_id, status_id, employee_id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    // 6️⃣ Update leave_details
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE leave_details SET balanced_leaves = balanced_leaves - 1, used_leaves = used_leaves + 1 WHERE leave_details_id = ?",
        [leaveDetails.leave_details_id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    return res.status(200).json({ success: true, message: "Optional leave applied successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};



export const removeOptionalLeave = async (req, res) => {
  const { employee_id, holiday_date } = req.body;

  if (!employee_id || !holiday_date)
    return res.status(400).json({ success: false, message: "Missing employee_id or holiday_date" });

  try {
    // 1️⃣ Get leave_type_id for Optional leave
    const leaveTypeRows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT leave_type_id FROM leave_type WHERE leave_type_name = 'Optional'",
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (leaveTypeRows.length === 0)
      return res.status(404).json({ success: false, message: "Optional leave type not found" });

    const leave_type_id = leaveTypeRows[0].leave_type_id;

    // 2️⃣ Delete from leave_application
    const deleteResult = await new Promise((resolve, reject) => {
      db.query(
        "DELETE FROM leave_application WHERE employee_id = ? AND leave_type_id = ? AND start_date = ?",
        [employee_id, leave_type_id, holiday_date],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    if (!deleteResult.affectedRows)
      return res.status(404).json({ success: false, message: "Applied leave not found" });

    // 3️⃣ Update leave_details
    await new Promise((resolve, reject) => {
      db.query(
        "UPDATE leave_details SET balanced_leaves = balanced_leaves + 1, used_leaves = used_leaves - 1 WHERE employee_id = ? AND leave_type_id = ?",
        [employee_id, leave_type_id],
        (err, result) => (err ? reject(err) : resolve(result))
      );
    });

    return res.status(200).json({ success: true, message: "Optional leave removed successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};


export const getAppliedOptionalLeaves = async (req, res) => {
  const { employee_id } = req.params;

  if (!employee_id)
    return res.status(400).json({ success: false, message: "Missing employee_id" });

  try {
    // 1️⃣ Get leave_type_id for Optional leave
    const leaveTypeRows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT leave_type_id FROM leave_type WHERE leave_type_name = 'Optional'",
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (leaveTypeRows.length === 0)
      return res.status(404).json({ success: false, message: "Optional leave type not found" });

    const leave_type_id = leaveTypeRows[0].leave_type_id;

    // 2️⃣ Get status_id for 'Approved'
    const statusRows = await new Promise((resolve, reject) => {
      db.query(
        "SELECT status_id FROM status WHERE status_name = 'Approved'",
        (err, rows) => (err ? reject(err) : resolve(rows))
      );
    });

    if (statusRows.length === 0)
      return res.status(404).json({ success: false, message: "'Approved' status not found" });

    const status_id = statusRows[0].status_id;

    // 3️⃣ Get applied leaves from leave_application
    const appliedLeaves = await new Promise((resolve, reject) => {
      const getAppliedQuery = `
        SELECT 
    DATE_FORMAT(start_date, '%Y-%m-%d') AS start_date,
    DATE_FORMAT(end_date, '%Y-%m-%d') AS end_date,
    leave_purpose
  FROM leave_application
  WHERE employee_id = ? AND leave_type_id = ? AND status_id = ?

      `;
      db.query(getAppliedQuery, [employee_id, leave_type_id, status_id], (err, rows) =>
        err ? reject(err) : resolve(rows)
      );
    });

    return res.status(200).json({ success: true, appliedLeaves });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};




