import nodemailer from "nodemailer";
import { ENV } from "./env.js";

// Use Gmail service directly (no need for host/port/secure)
export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS, // must be a Gmail App Password
  },
  connectionTimeout: 10000, // 10 seconds
  tls: {
    rejectUnauthorized: false, // bypasses some SSL issues
  },
});

export const sender = {
  name: ENV.EMAIL_FROM_NAME || "YapYard",
  email: ENV.EMAIL_FROM || ENV.SMTP_USER,
};
