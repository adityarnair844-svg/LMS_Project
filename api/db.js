import mysql from "mysql2";

export const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Adi@2005#",
  database: "leave_management",
});

db.connect(err => {
  if (err) console.error("❌ DB connection failed:", err);
  else console.log("✅ DB connected");
});