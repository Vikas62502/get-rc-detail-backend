import mongoose, { Document, Schema } from "mongoose";

// Define the interface for the Transaction document
interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  vehicleNumber: string;
  transactionType: "debit" | "credit";
  amount: number;
  timestamp: Date;
}

// Define the Transaction schema
const transactionSchema = new Schema<ITransaction>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  vehicleNumber: { type: String, required: false },
  transactionType: { type: String, enum: ["debit", "credit"], required: true },
  amount: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
});

// Create the Transaction model
const Transaction = mongoose.model<ITransaction>(
  "Transaction",
  transactionSchema
);

export default Transaction;
