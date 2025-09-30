import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import AdminDashboard from "./AdminDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import ManagerDashboard from "./ManagerDashboard";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { currentUser } = useContext(AuthContext);

  if (!currentUser) return <Navigate to="/login" />;

  switch (currentUser.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "EMPLOYEE":
      return <EmployeeDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    default:
      return <div>Unauthorized</div>;
  }
};

export default Home;
