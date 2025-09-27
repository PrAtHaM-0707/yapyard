// auth.controller.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { ENV } from "../lib/env.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { sendOtpEmail } from "../emails/emailHandlers.js";
import { generateToken } from "../lib/utils.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

const validateUsername = (username) => {
  if (!username) return "Username is required";
  if (!/^[a-z0-9._]+$/.test(username)) return "Username can only contain lowercase letters, numbers, dots, and underscores";
  if (username.endsWith(".") || username.endsWith("_")) return "Username cannot end with a dot or underscore";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (username.length > 30) return "Username must be at most 30 characters";
  return null;
};

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (fullName.length > 50) {
      return res.status(400).json({ message: "Full name must be at most 50 characters" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    let existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    // Generate and send OTP
    const otp = generateOtp();
    const hashedOtp = await bcrypt.hash(otp, salt);
    savedUser.otp = hashedOtp;
    savedUser.otpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
    await savedUser.save();

    await sendOtpEmail(email, otp, ENV.CLIENT_URL);

    res.status(201).json({ message: "User created. Verify email with OTP.", email });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) return res.status(400).json({ message: "Email and OTP required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const isValid = await bcrypt.compare(otp, user.otp);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified. Set username.", email });
  } catch (error) {
    console.log("Error in verifyOtp:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const setUsername = async (req, res) => {
  const { email, username } = req.body;

  try {
    if (!email || !username) return res.status(400).json({ message: "Email and username required" });

    const usernameError = validateUsername(username);
    if (usernameError) return res.status(400).json({ message: usernameError });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    let finalUsername = username;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      const baseUsername = username.replace(/#\d+$/, "");
      const similarUsers = await User.find({ username: new RegExp(`^${baseUsername}(#\\d+)?$`) });
      const count = similarUsers.length + 1;
      finalUsername = `${baseUsername}#${count}`;
    }

    user.username = finalUsername;
    user.isVerified = true;
    await user.save();

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in setUsername:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified) return res.status(400).json({ message: "Email not verified" });
    if (!user.username) return res.status(400).json({ message: "Username not set" });

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = generateToken(user._id, res);
    console.log("Login response sent with user:", {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
    }, "Token:", token); // Log response and token
    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error in login controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) return res.status(400).json({ message: "Email required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const otp = generateOtp();
    const salt = await bcrypt.genSalt(10);
    const hashedOtp = await bcrypt.hash(otp, salt);
    user.otp = hashedOtp;
    user.otpExpiry = Date.now() + 10 * 60 * 1000;
    await user.save();

    await sendOtpEmail(email, otp, ENV.CLIENT_URL, true);

    res.status(200).json({ message: "OTP sent to email", email });
  } catch (error) {
    console.log("Error in forgotPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    if (!email || !otp || !newPassword) return res.status(400).json({ message: "All fields required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.otpExpiry < Date.now()) return res.status(400).json({ message: "OTP expired" });

    const isValid = await bcrypt.compare(otp, user.otp);
    if (!isValid) return res.status(400).json({ message: "Invalid OTP" });

    if (newPassword.length < 6) return res.status(400).json({ message: "Password must be at least 6 characters" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log("Error in resetPassword:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkUsername = async (req, res) => {
  const { username } = req.params;

  try {
    const usernameError = validateUsername(username);
    if (usernameError) return res.status(400).json({ message: usernameError });

    const existing = await User.findOne({ username });
    if (existing) return res.status(400).json({ message: "Username taken" });

    res.status(200).json({ available: true });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "Logged out successfully" });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    if (!profilePic) return res.status(400).json({ message: "Profile pic is required" });

    const userId = req.user._id;

    const uploadResponse = await cloudinary.uploader.upload(profilePic);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Error in update profile:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const blockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { blockUserId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { blockedUsers: blockUserId } },
      { new: true }
    ).select("-password");
    const blocker = await User.findById(userId).select("username _id");
    const receiverSocketId = getReceiverSocketId(blockUserId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("youAreBlocked", { byUser: blocker });
    }
    res.status(200).json({ message: "User blocked", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const userId = req.user._id;
    const { unblockUserId } = req.body;
    const user = await User.findByIdAndUpdate(
      userId,
      { $pull: { blockedUsers: unblockUserId } },
      { new: true }
    ).select("-password");
    res.status(200).json({ message: "User unblocked", user });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};