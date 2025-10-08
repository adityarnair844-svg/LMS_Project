import { useState, useEffect } from "react";
console.log("EmployeeList function called");
import axios from "axios";
import { FaEdit } from "react-icons/fa";

const EmployeeList = ({ onEdit }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/employee/all", {
          withCredentials: true,
        });
        console.log("Fetched employees:", res.data);
        // Filter out admin (assuming role === 'ADMIN')
        setEmployees(res.data.filter((emp) => emp.role !== "ADMIN"));
        setLoading(false);
      } catch (err) {
        console.error("Error fetching employees:", err);
        setError("Failed to load employees");
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  console.log("Rendering EmployeeList with", employees.length, "employees");
  // TEMP: Add a visible test div

  if (loading) return <div>Loading employees...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div style={{ width: "100%", maxWidth: 700, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 20 }}>Employees</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ padding: 8, border: "1px solid #ddd" }}>ID</th>
            <th style={{ padding: 8, border: "1px solid #ddd" }}>Name</th>
            <th style={{ padding: 8, border: "1px solid #ddd" }}>Email</th>
            <th style={{ padding: 8, border: "1px solid #ddd" }}>Role</th>
            <th style={{ padding: 8, border: "1px solid #ddd" }}>Edit</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((emp) => (
            <tr key={emp.employee_id}>
              <td style={{ padding: 8, border: "1px solid #ddd" }}>
                {emp.employee_id}
              </td>
              <td style={{ padding: 8, border: "1px solid #ddd" }}>
                {emp.first_name} {emp.last_name}
              </td>
              <td style={{ padding: 8, border: "1px solid #ddd" }}>
                {emp.email}
              </td>
              <td style={{ padding: 8, border: "1px solid #ddd" }}>
                {emp.role}
              </td>
              <td
                style={{
                  padding: 8,
                  border: "1px solid #ddd",
                  textAlign: "center",
                }}
              >
                <button
                  onClick={() => onEdit(emp)}
                  className="button-teal"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  <FaEdit color="#007bff" size={18} title="Edit" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeList;
