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

    const {
        leave_type_id,
        approval_type,
        leave_type_name,
        no_of_leaves
    } = req.body;
    const query = "INSERT INTO leave_type (leave_type_id, approval_type, leave_type_name, no_of_leaves_per_year) VALUES (?, ?, ?, ?)";
    console.log("Inserting this stupid table");
    db.query(query,
        [
            leave_type_id,
            approval_type,
            leave_type_name,
            no_of_leaves
        ],
        (err, data) => {
            if (err) {
                console.log("Error:", err, "Data:", data);
                return res.status(500).json("Error inserting Leaves");
            }
            console.log("Error:", err, "Data:", data);
            return res.status(201).json("Employee added successfully!");
        });
};

export const validateDelete = async (req, res) => {


    const { leave_type_id } = req.params;
    const query = "SELECT COUNT(*) AS count FROM leave_details WHERE leave_type_id = ?";
    console.log("Inserting this stupid table");
    db.query(query,
        [
            leave_type_id
        ],
        (err, data) => {
            if (err) {
                console.error("DB Error:", err);
                return res.status(500).json({ message: "Internal server error" });
            }

            const count = data[0].count; 

            if (count > 0) {
                return res.status(200).json({
                    canDelete: false,
                    message: "This leave type is assigned to employees and cannot be deleted."
                });
            } else {
                return res.status(200).json({
                    canDelete: true,
                    message: "This leave type can be safely deleted."
                });
            }
        });
};