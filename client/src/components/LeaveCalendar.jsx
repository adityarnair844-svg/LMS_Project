import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { 
    startOfMonth, endOfMonth, eachDayOfInterval, format, 
    isSameMonth, addMonths, subMonths, setYear, isWithinInterval, 
    startOfDay, endOfDay, isSameDay 
} from "date-fns";
import { FaCheckCircle, FaTimesCircle, FaClock, FaUmbrellaBeach } from "react-icons/fa";
import "../styles/LeaveCalendar.css";

const LeaveCalendar = () => {
    const { currentUser } = useContext(AuthContext);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [leaves, setLeaves] = useState([]);
    const [holidays, setHolidays] = useState([]);
    const [showYearSelector, setShowYearSelector] = useState(false);
    const [hoverData, setHoverData] = useState({ visible: false, content: [], x: 0, y: 0 });

    useEffect(() => {
        if (currentUser?.employee_id) fetchLeaves();
        fetchHolidays();
    }, [currentUser]);

    const fetchLeaves = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8800/api/leave/calendar/${currentUser.employee_id}`
            );
            setLeaves(res.data || []);
        } catch (err) {
            console.error("Error fetching leaves:", err);
        }
    };

    const fetchHolidays = async () => {
        try {
            const res = await axios.get("http://localhost:8800/api/holidays");
            if (Array.isArray(res.data)) setHolidays(res.data);
        } catch (err) {
            console.error("Error fetching holidays:", err);
        }
    };

    const handlePrev = () => setCurrentMonth(subMonths(currentMonth, 1));
    const handleNext = () => setCurrentMonth(addMonths(currentMonth, 1));
    const handleYearSelect = (year) => {
        setCurrentMonth(setYear(currentMonth, year));
        setShowYearSelector(false);
    };

    const getIconForStatus = (status) => {
        if (status === "Approved") return <FaCheckCircle className="icon approved" />;
        if (status === "Rejected") return <FaTimesCircle className="icon rejected" />;
        if (status === "Pending") return <FaClock className="icon pending" />;
        return <FaUmbrellaBeach className="icon other" />;
    };

    const getLeavesForDate = (date) =>
        leaves.filter((leave) =>
            isWithinInterval(date, {
                start: startOfDay(new Date(leave.start_date)),
                end: endOfDay(new Date(leave.end_date)),
            })
        );

    const getHolidayForDate = (date) => {
        return holidays.find(h => isSameDay(new Date(h.holiday_date), date));
    };

    const handleHover = (event, leavesToday, holiday) => {
        if (leavesToday.length === 0 && !holiday) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const containerRect = event.currentTarget.closest('.leave-calendar-container').getBoundingClientRect();

        const content = [];
        if (holiday) content.push({ name: holiday.holiday_name, type: "Holiday" });
        leavesToday.forEach(leave => content.push({ name: leave.leave_type_name, status: leave.status_name, type: "Leave", start_date: leave.start_date, end_date: leave.end_date }));

        setHoverData({
            visible: true,
            content,
            x: rect.left - containerRect.left + rect.width / 2,
            y: rect.top - containerRect.top,
        });
    };

    const handleLeave = () => setHoverData({ visible: false, content: [], x: 0, y: 0 });

    const today = new Date();
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const startWeekDay = firstDayOfMonth.getDay();

    const days = [
        ...Array(startWeekDay).fill(null),
        ...eachDayOfInterval({ start: firstDayOfMonth, end: lastDayOfMonth })
    ];

    const years = Array.from({ length: 6 }, (_, i) => 2023 + i);

    return (
        <div className="leave-calendar-container">
            <div className="calendar-header">
                <button onClick={handlePrev}>←</button>
                <h2 className="month-title" onClick={() => setShowYearSelector(!showYearSelector)}>
                    {format(currentMonth, "MMMM yyyy")}
                </h2>
                <button onClick={handleNext}>→</button>
            </div>

            {showYearSelector && (
                <div className="year-selector">
                    {years.map((y) => (
                        <div key={y} onClick={() => handleYearSelect(y)} className={y === currentMonth.getFullYear() ? "active" : ""}>
                            {y}
                        </div>
                    ))}
                </div>
            )}

            <div className="calendar-grid">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
                    <div key={idx} className={`calendar-day-header ${day === "Sun" || day === "Sat" ? "weekend" : ""}`}>
                        {day}
                    </div>
                ))}

                {days.map((day, idx) => {
                    if (!day) return <div key={idx} className="calendar-day-box empty"></div>;

                    const leavesToday = getLeavesForDate(day);
                    const holiday = getHolidayForDate(day);
                    const isToday = isSameDay(day, today);
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;

                    let dayClass = `calendar-day-box ${isSameMonth(day, currentMonth) ? "" : "dimmed"} ${isToday ? "today" : ""}`;

// Weekend styling similar to holidays
if (isWeekend) dayClass += " weekend-bg";  

// Holiday styling remains same
if (holiday) {
    dayClass += holiday.holiday_type === "FIXED" ? " fixed-holiday" : " optional-holiday";
}


                    return (
                        <div
                            key={idx}
                            className={dayClass}
                            onMouseEnter={(e) => handleHover(e, leavesToday, holiday)}
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
                <div className="leave-tooltip" style={{ left: hoverData.x, top: hoverData.y }}>
                    {hoverData.content.map((item, i) => (
                        <div key={i} className="tooltip-item">
                            {item.type === "Holiday" ? (
                                <strong>{item.name}</strong>
                            ) : (
                                <>
                                    <strong>{item.name}</strong> — {item.status}
                                    <div className="tooltip-sub">
                                        {format(new Date(item.start_date), "dd MMM")} → {format(new Date(item.end_date), "dd MMM")}
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default LeaveCalendar;
