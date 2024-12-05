import express from "express";
import {
  updateWalletBalance,
  getAllUsers,
} from "../../Controller/Admin/AdminController";
import { verifyAdmin } from "../../Utils/JWT/JWT";

const router = express.Router();

// Route for crediting or debiting from a user
router.post("/update-user-balance:userId", verifyAdmin, updateWalletBalance);

// Route for fetching all the users
router.post("/get-all-users", verifyAdmin, getAllUsers);

export default router;
