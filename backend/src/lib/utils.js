// utils.js
import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = (userId, res) => {
  const { JWT_SECRET } = ENV;
  if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  console.log("Generated JWT:", token); // Log token
  console.log("Cookie settings:", {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: ENV.NODE_ENV === "development" ? false : true,
  }); // Log cookie options
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "lax",
    secure: ENV.NODE_ENV === "development" ? false : true,
  });
  return token;
};