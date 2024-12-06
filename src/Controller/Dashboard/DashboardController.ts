import { Request, Response, RequestHandler } from "express";
import User from "../../Models/User/User"; // Assuming you have a User model for accessing user data
import Transaction from "../../Models/User/Transaction/Transaction";
import axios from "axios";
import jwt from "jsonwebtoken";
import { configDotenv } from 'dotenv';
configDotenv();

// Controller for getting user dashboard data
export const getUserDashboardData: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Assuming user data can be fetched using the user ID from the JWT token or a query parameter
    const userId = req.user?.id; // Assuming user is authenticated and the user ID is available in the req.user

    if (!userId) {
      res.status(400).json({ message: "User not authenticated." });
      return;
    }

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: "User not found." });
      return;
    }

    // Fetch the necessary data for the user's dashboard
    // This can include user profile data, statistics, etc.
    const userData = {
      fullname: user.fullname,
      email: user.email,
      mobile: user.mobile,
      balance: user.walletBalance
    };

    const transactions = await Transaction.find({
      where: { userId },
    });

    res
      .status(200)
      .json({
        message: "User dashboard data fetched successfully.",
        userData,
        transactions,
      });
  } catch (error) {
    console.error("Error fetching user dashboard data:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for getting a single RC (Registration Certificate)
export const getSingleRC: RequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { rcId } = req.params; // Assuming RC ID is provided in the request URL

    // Fetch RC data from the database or file system based on the rcId
    const rcData = await getVehicleDetails(rcId);

    if (!rcData) {
      res.status(404).json({ message: "RC not found." });
      return;
    }

    res.status(200).json({ message: "RC fetched successfully.", data: rcData });
  } catch (error) {
    console.error("Error fetching RC:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller for getting bulk RCs
// export const getBulkRCs: RequestHandler = async (
//   req: Request,
//   res: Response
// ): Promise<void> => {
//   try {
//     // Optionally, you can add query parameters or pagination
//     const { startDate, endDate } = req.query; // Example: filter by date range

//     // Fetch the bulk RC data based on the query or other filters
//     const bulkRCData = await getBulkRCData(startDate, endDate); // Assuming you have a function to fetch bulk RC data

//     if (!bulkRCData || bulkRCData.length === 0) {
//       res.status(404).json({ message: "No bulk RCs found." });
//       return;
//     }

//     res.status(200).json({ message: "Bulk RCs fetched successfully.", data: bulkRCData });
//   } catch (error) {
//     console.error("Error fetching bulk RCs:", error);
//     res.status(500).json({ message: "Internal Server Error" });
//   }
// };

// Helper function to fetch single RC data (you would likely query your database here)
function generateUniqueInteger() {
  return Math.floor(100000 + Math.random() * 900000);
}

const signatureKeyString = process.env.PAYSPRINTSIGNATUREKEY || "";
const signatureKey = Buffer.from(signatureKeyString);

// Function to generate the JWT token
const generateJwtToken = () => {
  // Current timestamp in seconds
  const timestamp = Math.floor(new Date().getTime() / 1000.0);
  // console.log(timestamp, "current timestamp");

  // JWT payload
  const payload = {
    timestamp: timestamp,      // Latest timestamp
    partnerId: process.env.PAYSPRINTPARTNERID,    // Static partner ID
    reqid: generateUniqueInteger()               // Unique six-digit request ID
  };
  // console.log(payload, "payload here");

  // JWT header
  const header = {
    typ: "JWT",   // Type of the token
    alg: "HS256"  // Hashing algorithm
  };

  // Sign the JWT token using HS256 and the decoded signature key, disabling the iat field
  const token = jwt.sign(payload, signatureKey, {
    algorithm: 'HS256',
    header: header,
    noTimestamp: true  // Disables the automatic inclusion of the iat field
  });

  // console.log(token, "Generated JWT token for RC verification without iat");
  return token;
};
const getVehicleDetails = async (vehicleNumber: string) => {
  const url = process.env.PAYSPRINTBASEURL!
  const headers = {
    "Content-Type": "application/json",
    Token: generateJwtToken(),
    accept: "application/json",
    // authorisedkey: process.env.PAYSPRINTAUTHKEY,
  };

  const data = {
    refid: generateUniqueInteger(),
    id_number: vehicleNumber,
  };

  try {
    const response = await axios.post(url, data, { headers });
    return response.data;
  } catch (error) {
    throw error;
  }
};
