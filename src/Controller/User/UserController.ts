import express, { Request, Response, RequestHandler } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../Models/User/User";
import {
  validateEmail,
  validateNumber,
} from "../../Utils/Email and Phone Validation/EmailAndPhoneValidate";

// Correct typing with RequestHandler and no need to return a Response directly
export const signUp: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { fullname, email, mobile, password, role } = req.body;

  if (!fullname || !email || !mobile || !password || !role) {
    res.status(400).json({
      success: false,
      messsage: "Missing Required Fields",
    });
  }

  if (!validateEmail(email) || !validateNumber(mobile)) {
    res.status(400).json({
      success: false,
      messsage: "Invalid Email or Phone No.",
    });
  }

  if (role !== "Admin" && role !== "User") {
    res.status(400).json({
      success: false,
      messsage: "Invalid Role",
    });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists." });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      mobile,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error during user signup:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      success: false,
      messsage: "Missing Required Fields",
    });
  }

  if (!validateEmail(email)) {
    res.status(400).json({
      success: false,
      messsage: "Enter Valid Email",
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: "Invalid credentials." });
      return;
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET ||
        "8210aa8984abe0307e3b2c8d9136f8d4bd7e33bd91c5f43dfb59deb59e15c46b",
      { expiresIn: "24h" }
    );

    const refreshToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.REFRESH_TOKEN_SECRET ||
        "8844a1ab010d58da996ecf0c06c7293121bf25206cc02cd9a5257d3d2c5fa21d",
      { expiresIn: "7d" }
    );

    res.status(200).json({ message: "Login successful!", token, refreshToken });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
