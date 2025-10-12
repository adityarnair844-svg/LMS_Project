import { db } from "../db.js";

export const getLeaveTypes = async (req, res) => {
  const query = `
    SELECT * FROM leave_type;
  `;
  db.query(query, (err, data) => {
    if (err) return res.status(500).json("Database error: " + err.message);
    console.log("Error:", err, "Data:", data);
    if (!data || data.length === 0) {
      console.log("No leaves found");
      return res.status(200).json("No leaves found.");
    }
    return res.status(200).json(data);
  });
};

export const addLeaves = async (req, res) => {
  const { leave_type_id, approval_type, leave_type_name, no_of_leaves } =
    req.body;
  const query =
    "INSERT INTO leave_type (leave_type_id, approval_type, leave_type_name, no_of_leaves_per_year) VALUES (?, ?, ?, ?)";
  console.log("Inserting this stupid table");
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
