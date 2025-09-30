import { db } from "../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = (req, res) => {
  const { username, password } = req.body;
  //VALIDATING THE INPUT
  if (!username || !password) {
    return res.status(400).json("All fields are required.");
  }

  //FINDING USER IN employee_login
  const loginQuery = "SELECT * FROM employee_login WHERE employee_id = ?";
  db.query(loginQuery, [username], (err, data) => {
    if (err) return res.status(500).json("Database error.");
    if (data.length === 0) return res.status(404).json("User not found!");

    const user = data[0];

    //COMPARING ENTERED PASSWORD WITH STORED HASHED PASSWORD
    const isPasswordCorrect = bcrypt.compareSync(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json("Invalid password.");
    }
   
    const token = jwt.sign({id: user.employee_id, role: user.role}, "jwtkey", { expiresIn: "1h" });
    //REMOVE PASSWORD BEFORE SENDING RESPONSE
    const { password: hashedPassword, ...other } = data[0];

    res.cookie("access_token", token , {
      httpOnly:true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax"
    }).status(200).json({
      message: "Login successful.",
      user: other
  });
  });
};

export const forgotpass = (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;
  //VALIDATING THE INPUT
  if (!email || !newPassword || !confirmPassword) {
    return res.status(400).json("All fields are required.");
  }
  if (newPassword !== confirmPassword) {
    return res.status(400).json("Passwords do not match.");
  }

  if (newPassword.length < 8) {
    return res.status(400).json("Password must be at least 8 characters.");
  }
  //CHECKING IF EMAIL EXISTS
  const checkEmployeeQuery = "SELECT * FROM employee WHERE email = ?";
  db.query(checkEmployeeQuery, [email], (err, data) => {
    if (err) {
      console.error("Error checking employee:",err)
      return res.status(500).json(err);}
      console.log("Employee data found:",data)
    if (data.length === 0) {
      return res.status(404).json("If the email is registered, password has been updated.");
    }

    const employeeId = data[0].employee_id;

    //HASHING THE NEW PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(newPassword, salt);

    // UPDATING PASSWORD IN employee_login TABLE
    const updateQuery =
      "UPDATE employee_login SET password = ? WHERE employee_id = ?";
    db.query(updateQuery, [hashedPassword, employeeId], (err, result) => {
      if (err) {
         console.error("Error in UPDATE employee_login:", err);
        return res.status(500).json("Error updating password.");
      }
      return res.status(200).json("Password successfully changed.");
    });
  });
};

export const logout = (req, res) => {

    res.clearCookie("access_token",{
      httpOnly: true,
      sameSite:"Lax",
      secure:true
    }).status(200).json("User has been logged out")
}