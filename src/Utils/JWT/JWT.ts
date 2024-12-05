import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Define a custom type for the user object
interface IUser {
  id: string;
  email: string;
  role: "Admin" | "User";
  // Add any other fields as needed
}

// Extend the Express Request interface to include the user property
declare global {
  namespace Express {
    interface Request {
      user?: IUser; // Optional user property
    }
  }
}

// Type-safe verifyToken middleware
export function verifyToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1]; // Extract token from the authorization header

    jwt.verify(token, process.env.JWT_SECRET as string, (err, user) => {
      if (err) {
        const error = new Error("Token is not valid!");
        (error as any).statusCode = 403;
        return next(error);
      }

      req.user = user as IUser; // Attach user to request object
      next(); // Call next middleware or controller
    });
  } else {
    const error = new Error("You are not authenticated!");
    (error as any).statusCode = 401;
    return next(error);
  }
}

export function verifyAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  verifyToken(req, res, () => {
    // Assuming user data can be fetched using the user ID from the JWT token
    const role = req.user?.role; // Assuming `req.user` contains authenticated user information
    if (!role || role !== "Admin") {
      res.status(401).json({
        message: "Unauthorized. Only Admin can update wallet balance.",
      });
      return;
    }
  });
}
