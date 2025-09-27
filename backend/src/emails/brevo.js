import SibApiV3Sdk from "@sendinblue/client";
import { ENV } from "./env.js";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = ENV.SENDINBLUE_API_KEY;

export const sendEmail = async ({ to, subject, html }) => {
  const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();
  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
    to: [{ email: to }],
    sender: { email: ENV.EMAIL_FROM, name: ENV.EMAIL_FROM_NAME },
    subject,
    htmlContent: html,
  });

  try {
    const response = await tranEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent:", response.messageId || response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email");
  }
};
