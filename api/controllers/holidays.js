import { db } from "../db.js";

// Fetch all holidays
export const getHolidays = async (req, res) => {
  const query = `
    SELECT 
      holiday_id,
      holiday_name,
      DATE_FORMAT(holiday_date, '%Y-%m-%d') AS holiday_date,
      holiday_type,
      created_by,
      created_at
    FROM holidays
    ORDER BY holiday_type ASC, holiday_date ASC;
  `;
  db.query(query, (err, data) => {
    if (err) {
      console.error("Error fetching holidays:", err);
      return res.status(500).json("Database error: " + err.message);
    }
    console.log(data);
    if (!data || data.length === 0) {
      return res.status(200).json("No holidays found.");
    }
    return res.status(200).json(data);
  });
};

// Update a holiday
export const updateHoliday = async (req, res) => {
  const { id } = req.params;
  const { holiday_name, holiday_date, holiday_type } = req.body;

  if (!holiday_name || !holiday_date || !holiday_type) {
    return res.status(400).json("Missing required fields.");
  }

  const query = `
    UPDATE holidays 
    SET holiday_name = ?, holiday_date = ?, holiday_type = ?
    WHERE holiday_id = ?;
  `;

  db.query(query, [holiday_name, holiday_date, holiday_type, id], (err, result) => {
    if (err) {
      console.error("Error updating holiday:", err);
      return res.status(500).json("Database error: " + err.message);
    }
    if (result.affectedRows === 0) {
      return res.status(404).json("Holiday not found.");
    }
    return res.status(200).json({ message: "Holiday updated successfully." });
  });
};

// Publish all holidays (can be expanded later)
export const publishHolidays = async (req, res) => {
  try {
    // Here you could add logic to set a `published` flag if needed
    console.log("Publishing all holidays...");
    return res.status(200).json({ message: "All holidays published successfully." });
  } catch (err) {
    console.error("Error publishing holidays:", err);
    return res.status(500).json("Error publishing holidays: " + err.message);
  }
};

