import { Request, Response, RequestHandler } from "express";
import User from "../../Models/User/User"; // Assuming you have a User model for accessing user data
import Transaction from "../../Models/User/Transaction/Transaction";

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
      balance : user.walletBalance
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
    const rcData = await getRCData(rcId); // Assuming you have a function to fetch RC data

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
const getRCData = async (rcId: string) => {
  // Replace with actual logic to fetch RC data
  return { rcId, owner: "Raj Kamal Prabhakar", vehicle: "XYZ 1234" }; // Example
};

// Helper function to fetch bulk RC data (you would likely query your database here)
// const getBulkRCData = async (startDate?: string, endDate?: string) => {
//   // Replace with actual logic to fetch bulk RC data
//   return [
//     { rcId: "RC1", owner: "Raj Kamal Prabhakar", vehicle: "XYZ 1234" },
//     { rcId: "RC2", owner: "John Doe", vehicle: "ABC 5678" },
//   ]; // Example
// };
