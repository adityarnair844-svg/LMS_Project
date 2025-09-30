import express from "express";
import {
  addEmployee,
  updateEmployee,
  getAllEmployees,
} from "../controllers/employee.js";

const router = express.Router();

router.post("/add", addEmployee);
router.put("/:employee_id", updateEmployee);
router.get("/all", getAllEmployees);

export default router;
