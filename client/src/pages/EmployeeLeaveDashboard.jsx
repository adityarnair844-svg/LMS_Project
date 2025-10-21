import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LeaveTable from '../components/LeaveTable';
import { AuthContext } from "../context/authContext";
import SavedLeaves from "../components/SavedLeaves";
import LeaveCard from "../components/LeaveCard";
import LeaveStatusTable from "../components/LeaveStatusTable";

const EmployeeLeaveDashboard = () => {
    const { currentUser } = useContext(AuthContext);
    const [leaves, setLeaves] = useState([]);
    const [appliedLeavesMap, setAppliedLeavesMap] = useState({});
    const [success, setSuccess] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [statusLeaves, setStatusLeaves] = useState([]);
    const navigate = useNavigate();

    const fetchLeavesByEmployee = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8800/api/leave/getLeaveDetailsById/${currentUser.employee_id}`
            );
            const data = Array.isArray(res.data) ? res.data : [res.data];
            setLeaves(data);
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
                map[leave.leave_type_id] = res.data.appliedLeaves || 0;
            }
            setAppliedLeavesMap(map);
        } catch (err) {
            console.error("Error fetching applied leaves:", err);
        }
    };

    const fetchStatusLeaves = async (status) => {
        try {
            const res = await axios.get(
                `http://localhost:8800/api/leave/getLeavesByStatus/${currentUser.employee_id}/${status}`
            );
            setStatusLeaves(res.data || []);
            setSelectedStatus(status);
        } catch (err) {
            console.error("Error fetching status leaves:", err);
        }
    };

    const handleCardClick = (status) => {
        if (selectedStatus === status) {
            setSelectedStatus(null); // toggle close if clicked again
        } else {
            fetchStatusLeaves(status);
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

  useEffect(() => {
  if (success) {
    fetchLeavesByEmployee();  // Refresh data
    fetchAppliedLeaves();
    setSuccess(false);        // Reset the flag
  }
}, [success]);

    return (
        <div>
            <div className="employee-leave-dashboard">
                {leaves.map((leave) => (
                    <span key={leave.leave_type_id}>
                        <span style={{ fontFamily: "serif", fontWeight: "550" }}>
                            {leave.leave_type_name} Leave
                        </span>
                        <LeaveTable leave={leave} appliedLeaves={appliedLeavesMap[leave.leave_type_id] || 0} />
                    </span>
                ))}
            </div>

            <div style={{ margin: "12px", fontFamily: "serif" }}>
                <button onClick={() => navigate("/leaveRequest")}>
                    New Request &nbsp;&nbsp;&nbsp;
                    <span style={{ fontWeight: "bold", fontSize: "17px" }}>+</span>
                </button>
            </div>

            <LeaveCard onCardClick={handleCardClick} activeStatus={selectedStatus} refreshTrigger={success}/>

            {selectedStatus && (
                <LeaveStatusTable
                    status={selectedStatus}
                    leaves={statusLeaves}
                    onClose={() => setSelectedStatus(null)}
                />
            )}

            <SavedLeaves onSuccess={()=>{setSuccess(true)}}></SavedLeaves>
        </div>

    );

};



export default EmployeeLeaveDashboard;