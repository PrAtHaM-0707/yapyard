import { sendEmail } from "../lib/brevo.js";
import { createWelcomeEmailTemplate, createOtpEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  console.log("Preparing to send welcome email to:", email);
  const html = createWelcomeEmailTemplate(name, clientURL);
  try {
    await sendEmail({ to: email, subject: "Welcome to YapYard!", html });
    console.log("Welcome email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send welcome email to:", email, error);
    throw error;
  }
};

export const sendOtpEmail = async (email, otp, clientURL, isReset = false) => {
  console.log("Preparing to send OTP email to:", email, { isReset });
  const html = createOtpEmailTemplate(otp, clientURL, isReset);
  const subject = isReset ? "Reset Your Password" : "Verify Your Email";
  try {
    await sendEmail({ to: email, subject, html });
    console.log("OTP email sent successfully to:", email);
  } catch (error) {
    console.error("Failed to send OTP email to:", email, error);
    throw error;
  }
};