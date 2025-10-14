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
    if (err)
      return res.status(500).json({ message: "DB error: " + err.message });
    if (!leaveData || leaveData.length === 0)
      return res.status(404).json({ message: "Leave type not found" });

    // Insert for employees if not already assigned
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
    db.query(insertQuery, [leave_type_id, leave_type_id], (err2, result) => {
      if (err2)
        return res.status(500).json({ message: "DB error: " + err2.message });
      return res
        .status(200)
        .json({
          message: "Leave synced for all employees",
          addedRows: result.affectedRows,
        });
    });
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
        const la_query = "SELECT COUNT(*) as count FROM leave_application";
        db.query(la_query, [], (err, data) => {
            if (err) return reject(err);
            const id = "LA" + String(data[0].count + 1).padStart(4, "0"); // e.g., LA0001
            resolve(id);
        });
    });

};

export const applyLeave = async (req, res) => {
  try {
    const {
      leave_type_id,
      start_date,
      start_half,
      end_date,
      end_half,
      reason,
      status,       // "Saved" or "Pending"
      employee_id,
      num_days      // sent from frontend
    } = req.body;

    // --- Validate required fields ---
    if (!leave_type_id || !start_date || !start_half || !end_date || !end_half || !reason || !status || !employee_id || num_days === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const leave_application_id = await generateLeaveApplicationId();
    const applied_date = new Date().toISOString().slice(0, 10); // YYYY-MM-DD

    // --- Fetch status_id from status table ---
    const statusQuery = `SELECT status_id FROM status WHERE status_name = ? LIMIT 1`;
    db.query(statusQuery, [status], (err, statusResult) => {
      if (err) return res.status(500).json({ message: "DB error fetching status", error: err.message });
      if (statusResult.length === 0) return res.status(400).json({ message: "Invalid status" });

      const status_id = statusResult[0].status_id;

      // --- Insert into leave_application ---
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
          num_days,       // use frontend calculated days
          applied_date,
          leave_type_id,
          status_id,
          employee_id,
          null
        ],
        (err, data) => {
          if (err) return res.status(500).json({ message: "Database error", error: err.message });

          return res.status(200).json({
            message: `Leave ${status === "Saved" ? "saved" : "submitted"} successfully`,
            leave_application_id,
            leave_days: num_days
          });
        }
      );
    });
  } catch (err) {
    console.error("Error applying leave:", err);
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
    [ approval_type, leave_type_name, no_of_leaves, leave_type_id],
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

  const getStatusIdQuery = "SELECT status_id FROM status WHERE status_name = ?";
  db.query(getStatusIdQuery, [status_name], (err, result) => {
    if (err || result.length === 0) return res.status(400).json({ message: "Invalid status" });

    const status_id = result[0].status_id;
    const updateQuery = `
      UPDATE leave_application 
      SET status_id = ?, status_note = ? 
      WHERE leave_application_id = ?;
    `;
    db.query(updateQuery, [status_id, status_note, leave_application_id], (err2) => {
      if (err2) return res.status(500).json({ message: "Error updating status", error: err2 });
      return res.status(200).json({ message: "Status updated successfully" });
    });
  });
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





