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
  if (
    !employee_id ||
    !first_name ||
    !last_name ||
    !designation ||
    !email ||
    !phone_no ||
    !password ||
    !role
  ) {
    return res.status(400).json("All fields are required.");
  }

  // Check if employee_id or email already exists
  const checkQuery =
    "SELECT * FROM employee WHERE employee_id = ? OR email = ?";
  db.query(checkQuery, [employee_id, email], (err, data) => {
    if (err) return res.status(500).json("Database error");
    if (data.length > 0)
      return res.status(409).json("Employee ID or email already exists.");

    // Insert into employee table
    const insertEmployeeQuery =
      "INSERT INTO employee (employee_id, first_name, last_name, designation, email, department, phone_no, manager_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.query(
      insertEmployeeQuery,
      [
        employee_id,
        first_name,
        last_name,
        designation,
        email,
        department || null,
        phone_no,
        manager_id || null,
      ],
      (err2) => {
        if (err2) return res.status(500).json("Error inserting employee.");

        // Hash password and insert into login table
        const hashedPassword = bcrypt.hashSync(password, 10);
        const insertLoginQuery =
          "INSERT INTO employee_login (login_id, employee_id, role, password) VALUES (?, ?, ?, ?)";
        const login_id = "L" + employee_id; // simple login_id generation
        db.query(
          insertLoginQuery,
          [login_id, employee_id, role, hashedPassword],
          (err3) => {
            if (err3) return res.status(500).json("Error inserting login.");
            return res.status(201).json("Employee added successfully!");
          }
        );
      }
    );
  });
};

export const updateEmployee = (req, res) => {
  const { employee_id } = req.params;
  const {
    first_name,
    last_name,
    designation,
    email,
    department,
    phone_no,
    manager_id,
    role,
  } = req.body;

  // Only allow updating allowed fields
  const updateQuery = `UPDATE employee SET first_name=?, last_name=?, designation=?, email=?, department=?, phone_no=?, manager_id=? WHERE employee_id=?`;
  db.query(
    updateQuery,
    [
      first_name,
      last_name,
      designation,
      email,
      department || null,
      phone_no,
      manager_id || null,
      employee_id,
    ],
    (err, result) => {
      if (err) return res.status(500).json("Database error: " + err.message);
      // Optionally update role in employee_login
      if (role) {
        const updateRoleQuery = `UPDATE employee_login SET role=? WHERE employee_id=?`;
        db.query(updateRoleQuery, [role, employee_id], (err2) => {
          if (err2)
            return res.status(500).json("Error updating role: " + err2.message);
          return res.status(200).json("Employee updated successfully");
        });
      } else {
        return res.status(200).json("Employee updated successfully");
      }
    }
  );
};

export const getAllEmployees = (req, res) => {
  const query = `
    SELECT e.*, l.role
    FROM employee e
    JOIN employee_login l ON e.employee_id = l.employee_id
  `;
  db.query(query, [], (err, data) => {
    if (err) return res.status(500).json("Database error: " + err.message);
    return res.status(200).json(data);
  });
};
