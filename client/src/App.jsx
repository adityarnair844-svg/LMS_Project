import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPass from "./pages/ForgotPass";
import "./style.scss";
//import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./Layout";
import LeaveCalendar from "./components/LeaveCalendar";
import OptionalHoliday from "./pages/OptionalHoliday";
import MyQueries from "./pages/MyQueries";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLeaveDashboard from "./pages/AdminLeaveDashboard";
import EmployeeLeaveDashboard from "./pages/EmployeeLeaveDashboard";
import LeaveRequest from "./components/LeaveRequest";
import LeaveApproval from "./components/LeaveApproval";
import AdminHoliday from "./pages/AdminHoliday";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    element: <Layout />,
    children: [
      {
        path: "/home",
      element: (
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      ),
      },
      {
        path: "/employee/leavedashboard",
        element: <EmployeeLeaveDashboard />,
      },
      {
        path: "/optionalholiday",
        element: <OptionalHoliday />,
      },
      {
        path: "/leavecalendar",
        element: <LeaveCalendar />,
      },
      {
        path: "/myqueries",
        element: <MyQueries />,
      },
      {
        path: "/admin/leavedashboard",
        element: <AdminLeaveDashboard />,
      },
      {
        path: "/manager/approval",
        element: <LeaveApproval />,
      },

      {
        path: "/leaveRequest",
        element: <LeaveRequest />,
      },
      {
        path: "/adminleave/optional",
        element: <AdminHoliday />
      }
    ],
  },

  {
    path: "/forgotpass",
    element: <ForgotPass />,
  },
]);
function App() {
  return (
    <div className="app">
      <div className="app_container">
        <RouterProvider router={router} />
      </div>
    </div>
  );
}

export default App;
