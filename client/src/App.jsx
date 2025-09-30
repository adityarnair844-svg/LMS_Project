import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ForgotPass from "./pages/ForgotPass";
import "./style.scss";
//import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Layout from "./Layout";
import LeaveCalendar from "./pages/LeaveCalendar";
import LeaveDashboard from "./pages/LeaveDashboard";
import CompDashboard from "./pages/CompDashboard";
import OptionalHoliday from "./pages/OptionalHoliday";
import MyQueries from "./pages/MyQueries";
import ProtectedRoute from "./components/ProtectedRoute";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },

  {
    path: "/",
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
        path: "/compdashboard",
        element: <CompDashboard />,
      },
      {
        path: "/leavedashboard",
        element: <LeaveDashboard />,
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
