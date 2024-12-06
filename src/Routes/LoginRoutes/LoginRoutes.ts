import express from "express";
import { login, signUp } from "../../Controller/User/UserController";

const router = express.Router();

// Route for user signup
router.post("/user-signup", signUp);

// Route for user login
router.post("/user-login", login);

// Route for admin signup
router.post("/admin-signup", signUp);

// Route for admin login
router.post("/admin-login", login);

export default router;
