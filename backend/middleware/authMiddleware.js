import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, please login" });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select("-password");

      if (!user) {
        // Clear invalid cookie
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });
        return res
          .status(401)
          .json({ message: "Not authorized, user not found" });
      }

      req.user = user;
      next();
    } catch (error) {
      // Handle token verification errors
      if (error.name === "JsonWebTokenError") {
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });
        return res
          .status(401)
          .json({ message: "Invalid token, please login again" });
      }
      if (error.name === "TokenExpiredError") {
        res.clearCookie("jwt", {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
          path: "/",
        });
        return res
          .status(401)
          .json({ message: "Token expired, please login again" });
      }
      throw error;
    }
  } catch (error) {
    console.error("Auth error:", error);
    res.status(500).json({ message: "Server error during authentication" });
  }
};
