import express from "express";
import { login, forgotpass,logout } from "../controllers/auth.js";
const router = express.Router();

router.post("/login", login);

router.post("/forgotpass", forgotpass);
router.post("/logout", logout);

export default router;
