import nodemailer from "nodemailer";
import { ENV } from "./env.js";

export const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  auth: {
    user: ENV.SMTP_USER,
    pass: ENV.SMTP_PASS,
  },
  connectionTimeout: 10000,
  tls: { rejectUnauthorized: false },
});

export const sender = {
  name: ENV.EMAIL_FROM_NAME,
  email: ENV.EMAIL_FROM,
};
