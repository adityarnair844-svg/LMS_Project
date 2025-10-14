import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameMonth,
    addMonths,
    subMonths,
    setMonth,
    setYear,
} from "date-fns";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUmbrellaBeach } from "react-icons/fa";
import "../styles/LeaveCalendar.css";

const LeaveCalendar = () => {
    const { currentUser } = useContext(AuthContext);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [leaves, setLeaves] = useState([]);
    const [showYearSelector, setShowYearSelector] = useState(false);
    const [hoverData, setHoverData] = useState({ visible: false, content: [], x: 0, y: 0 });

    useEffect(() => {
        if (currentUser?.employee_id) fetchLeaves();
    }, [currentUser]);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8800/api/leave/calendar/${currentUser.employee_id}`
            );
            console.log("Cal", res.data)
            setLeaves(res.data || []);
        } catch (err) {
            console.error("Error fetching leaves:", err);
        }
    };

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const getIconForStatus = (status) => {
        if (status == "Approved") return <FaCheckCircle className="icon approved" />;
        if (status == "Rejected") return <FaTimesCircle className="icon rejected" />;
        if (status == "Pending") return <FaClock className="icon pending" />;
        return <FaUmbrellaBeach className="icon other" />;
    };

    const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));

    const getLeavesForDate = (date) =>
        leaves.filter((leave) =>
            isWithinInterval(date, {
                start: startOfDay(new Date(leave.start_date)),
                end: endOfDay(new Date(leave.end_date)),
            })
        );

    const handleHover = (event, leavesToday) => {
        if (leavesToday.length === 0) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = event.currentTarget.closest('.leave-calendar-container').getBoundingClientRect();

        setHoverData({
            visible: true,
            content: leavesToday,
            // Position relative to container
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top,
        });
    };

    const handleLeave = () => {
        setHoverData({ visible: false, content: [], x: 0, y: 0 });
    };

    const handleYearSelect = (year) => {
        setCurrentMonth(setYear(currentMonth, year));
        setShowYearSelector(false);
    };

    const years = Array.from({ length: 6 }, (_, i) => 2023 + i);

    return (
        <div className="leave-calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrev}>←</button>
                <h2
                    className="month-title"
                    onClick={() => setShowYearSelector(!showYearSelector)}
                >
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button onClick={handleNext}>→</button>
            </div>

            {showYearSelector && (
                <div className="year-selector">
                    {years.map((y) => (
                        <div
                            key={y}
                            onClick={() => handleYearSelect(y)}
                            className={y === currentMonth.getFullYear() ? "active" : ""}
                        >
                            {y}
                        </div>
                    ))}
                </div>
            )}

            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="calendar-day-header">
                        {day}
                    </div>
                ))}

                {days.map((day, idx) => {
                    const leavesToday = getLeavesForDate(day);
                    return (
                        <div
                            key={idx}
                            className={`calendar-day-box ${isSameMonth(day, currentMonth) ? "" : "dimmed"
                                }`}
                            onMouseEnter={(e) => handleHover(e, leavesToday)}
                            onMouseLeave={handleLeave}
                        >
                            <div className="day-number">{format(day, "d")}</div>
                            <div className="leave-icons">
                                {leavesToday.slice(0, 3).map((leave, i) => (
                                    <span key={i}>{getIconForStatus(leave.status_name)}</span>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {hoverData.visible && (
                <div
                    className="leave-tooltip"
                    style={{ left: hoverData.x, top: hoverData.y }}
                >
                    {hoverData.content.map((leave, i) => (
                        <div key={i} className="tooltip-item">
                            <strong>{leave.leave_type_name}</strong> — {leave.status_name}
                            <div className="tooltip-sub">
                                {format(new Date(leave.start_date), "dd MMM")} →{" "}
                                {format(new Date(leave.end_date), "dd MMM")}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaveCalendar;
