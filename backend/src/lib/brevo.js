import fetch from 'node-fetch';
import { ENV } from "./env.js";

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const payload = {
      sender: { name: ENV.EMAIL_FROM_NAME, email: ENV.EMAIL_FROM },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    };

    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': ENV.BREVO_API_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(`Failed to send email: ${JSON.stringify(errData)}`);
    }

    const data = await response.json();
    console.log("Email sent:", { id: data.messageId, to, subject, timestamp: new Date().toISOString() });
    return data;
  } catch (error) {
    console.error("Error sending email:", { to, subject, error: error.message, timestamp: new Date().toISOString() });
    throw new Error("Failed to send email: " + error.message);
  }
};