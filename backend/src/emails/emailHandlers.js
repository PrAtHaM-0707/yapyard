import { sendEmail } from "../lib/brevo.js";
import { createWelcomeEmailTemplate, createOtpEmailTemplate } from "../emails/emailTemplates.js";

export const sendWelcomeEmail = async (email, name, clientURL) => {
  const html = createWelcomeEmailTemplate(name, clientURL);
  await sendEmail({ to: email, subject: "Welcome to YapYard!", html });
};

export const sendOtpEmail = async (email, otp, clientURL, isReset = false) => {
  const html = createOtpEmailTemplate(otp, clientURL, isReset);
  const subject = isReset ? "Reset Your Password" : "Verify Your Email";
  await sendEmail({ to: email, subject, html });
};
