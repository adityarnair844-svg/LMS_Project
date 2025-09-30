import { db } from "../db.js";
import bcrypt from "bcrypt";

export const addEmployee = (req, res) => {
  const {
    employee_id,
    first_name,
    last_name,
    designation,
    email,
    department,
    phone_no,
    manager_id,
    password,
    role, // ADMIN, EMPLOYEE, MANAGER
  } = req.body;

  // Check all required fields
  if (!employee_id || !first_name || !last_name || !designation || !email || !phone_no || !password || !role) {
    return res.status(400).json("All fields are required.");
  }

  // Check if employee_id or email already exists
  const checkQuery = "SELECT * FROM employee WHERE employee_id = ? OR email = ?";
  db.query(checkQuery, [employee_id, email], (err, data) => {
    if (err) return res.status(500).json("Database error");
    if (data.length > 0) return res.status(409).json("Employee ID or email already exists.");

    // Insert into employee table
    const insertEmployeeQuery =
      "INSERT INTO employee (employee_id, first_name, last_name, designation, email, department, phone_no, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      insertEmployeeQuery,
      [employee_id, first_name, last_name, designation, email, department || null, phone_no, manager_id || null],
      (err2) => {
        if (err2) return res.status(500).json("Error inserting employee.");

        // Hash password and insert into login table
        const hashedPassword = bcrypt.hashSync(password, 10);
        const insertLoginQuery =
          "INSERT INTO employee_login (login_id, employee_id, role, password) VALUES (?, ?, ?, ?)";
        const login_id = "L" + employee_id; // simple login_id generation
        db.query(insertLoginQuery, [login_id, employee_id, role, hashedPassword], (err3) => {
          if (err3) return res.status(500).json("Error inserting login.");
          return res.status(201).json("Employee added successfully!");
        });
      }
    );
  });
};
