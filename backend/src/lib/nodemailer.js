import nodemailer from "nodemailer";
import { ENV } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: ENV.SMTP_HOST,
  port: ENV.SMTP_PORT,
  secure: ENV.SMTP_SECURE,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
  connectionTimeout: 10000, // 10 seconds
  tls: {
    rejectUnauthorized: false, // Helps with some server issues
  },
});

export const sender = {
  name: ENV.EMAIL_FROM_NAME,
  email: ENV.EMAIL_FROM,
};