import { RequestHandler } from "express";
import mongoose from "mongoose";
import User from "../../Models/User/User";
import Transaction from "../../Models/User/Transaction/Transaction";

// Define the RequestHandler for updating wallet balance
export const updateWalletBalance: RequestHandler = async (
  req,
  res
): Promise<void> => {
  try {
    const { userId } = req.params; // Get userId from route parameters
    const { amount, type, vehicleNumber } = req.body; // Get amount and transaction type from request body

    // Validate the request body
    if (
      !amount ||
      !type ||
      (type !== "credit" && type !== "debit") ||
      amount <= 0
    ) {
      res.status(400).json({ message: "Missing or invalid parameters." });
      return;
    }

    if (!userId) {
      res.status(400).json({ message: "User ID is required." });
      return;
    }

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Calculate the new wallet balance
    const balanceToAdd = type === "credit" ? amount : -amount;
    const newBalance = (user.walletBalance || 0) + balanceToAdd;

    // Ensure the balance does not go below zero
    if (newBalance < 0) {
      res
        .status(400)
        .json({ message: "Insufficient wallet balance for this operation." });
      return;
    }

    // Update the user's wallet balance
    user.walletBalance = newBalance;
    await user.save();

    // Create a new transaction record
    const transaction = new Transaction({
      userId,
      vehicleNumber: vehicleNumber || null, // Assuming vehicleNumber exists in the user model
      transactionType: type,
      amount: amount,
      timestamp: new Date(),
    });

    await transaction.save();

    res.status(200).json({
      message: "Wallet balance updated successfully.",
      walletBalance: user.walletBalance,
      transaction,
    });
  } catch (error) {
    console.error("Error updating wallet balance:", error);
    res.status(500).json({ message: "Internal Server Error." });
  }
};

// Define the RequestHandler for updating wallet balance
export const getAllUsers: RequestHandler = async (req, res): Promise<void> => {
  try {
    const users = await User.find({
      where: {},
    });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error updating wallet balance:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
};
