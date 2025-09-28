// auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    //console.log("Cookies received:", req.cookies);
    if (!token) {
      //console.log("No JWT token in cookies");
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const decoded = jwt.verify(token, ENV.JWT_SECRET);
    //console.log("JWT decoded:", decoded); 
    if (!decoded) return res.status(401).json({ message: "Unauthorized - Invalid token" });

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (error) {
    console.log("Error in protectRoute middleware:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};