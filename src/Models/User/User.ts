import mongoose, { Schema, Document } from "mongoose";

// Define the interface for the User document
export interface IUser extends Document {
  fullname: string;
  email: string;
  mobile: string;
  password: string;
  walletBalance: number;
  role: "Admin" | "User";
  createdAt?: Date;
  updatedAt?: Date;
}

// Create the User schema
const UserSchema: Schema<IUser> = new Schema(
  {
    fullname: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
      unique: true,
      match: /^[0-9]{10}$/, // Validates 10-digit mobile numbers
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters long"],
    },
    walletBalance: {
      type: Number,
      required: true,
      default: 0, // Default balance is 0
      min: [0, "Wallet balance cannot be negative"],
    },
    role: {
      type: String,
      enum: ["Admin", "User"],
      required: true,
    },
  },
  {
    timestamps: true, // Automatically includes createdAt and updatedAt fields
  }
);

// Export the User model
const User = mongoose.model<IUser>("User", UserSchema);
export default User;
