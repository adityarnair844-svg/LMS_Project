import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LeaveTable from '../components/LeaveTable';
import { AuthContext } from "../context/authContext";
import SavedLeaves from "../components/SavedLeaves";

const EmployeeLeaveDashboard = () => {

    const { currentUser } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [appliedLeavesMap, setAppliedLeavesMap] = useState({});
    const navigate = useNavigate();

    const fetchLeavesByEmployee = async () => {
        try {
            const res = await axios.get(`http://localhost:8800/api/leave/getLeaveDetailsById/${currentUser.employee_id}`);
            const data = Array.isArray(res.data) ? res.data : [res.data];
            setLeaves(data);
            console.log("Leaves", data);
        } catch (err) {
            console.error("Error fetching leaves:", err);
        }
    };

    const fetchAppliedLeaves = async () => {
    try {
      const map = {};
      for (const leave of leaves) {
        const res = await axios.get(
          `http://localhost:8800/api/leave/getAppliedLeaves/${currentUser.employee_id}/${leave.leave_type_id}`
        );
        map[leave.leave_type_id] = res.data.count || 0;
      }
      setAppliedLeavesMap(map);
      console.log("Applied Leaves Map:", map);
    } catch (err) {
      console.error("Error fetching applied leaves:", err);
    }
  };


    useEffect(() => {
        fetchLeavesByEmployee();
    }, []);

    useEffect(() => {
    if (leaves.length > 0) {
      fetchAppliedLeaves();
    }
  }, [leaves]);

    return (
        <div>
            <div className="employee-leave-dashboard" >
                {leaves.map((leave) => (
                    <span key={leave.leave_type_id}>
                        {leave.leave_type_name} Leave
                        <LeaveTable leave={leave} appliedLeaves={appliedLeavesMap[leave.leave_type_id] || 0} />
                    </span>
                ))}
            </div>
            <div style={{margin: "12px"}}>
                <button onClick={() => navigate("/leaveRequest")}>New Request &nbsp;&nbsp;&nbsp;<span style={{fontWeight: "bold", fontSize: "17px"}}>+</span></button>
            </div>

            <SavedLeaves></SavedLeaves>
        </div>

    );

};



export default EmployeeLeaveDashboard;