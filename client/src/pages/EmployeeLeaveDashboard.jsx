import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import LeaveTable from '../components/LeaveTable';
import { AuthContext } from "../context/authContext";

const EmployeeLeaveDashboard = () => {

    const { currentUser } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    
    const fetchLeavesByEmployee = async () => {
        try {
            const res = await axios.get(`http://localhost:8800/api/leave/getLeaveDetailsById/${currentUser.employee_id}`);
            const data = Array.isArray(res.data) ? res.data : [res.data];
            setLeaves(data);
            console.log("Leaves", leaves);
        } catch (err) {
            console.error("Error fetching leaves:", err);
        }
    };


    useEffect(() => {
        fetchLeavesByEmployee();
    }, []);

    return (

        <div className="employee-leave-dashboard" >
            {leaves.map((leave) => (
                <span>
                    {leave.leave_type_name} Leave
                    <LeaveTable key={leave.leave_type_id} leave={leave} />
                </span>
            ))}
        </div>

    );

};



export default EmployeeLeaveDashboard;