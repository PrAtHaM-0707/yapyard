export function createWelcomeEmailTemplate(name) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to YapYard</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdf4ff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(to right, #f59e0b, #ec4899, #8b5cf6); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 700;">Welcome to YapYard 🎉</h1>
    </div>

    <!-- Main Content -->
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <p style="font-size: 18px; color: #8b5cf6; font-weight: 600; margin-top: 0;">Hello ${name},</p>
      <p style="margin-bottom: 20px;">We’re thrilled to have you onboard! YapYard lets you chat, share, and connect with friends, family, and colleagues in real-time 🚀</p>
      
      <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 25px 0; border-left: 5px solid #ec4899;">
        <p style="font-size: 16px; font-weight: 600; margin: 0 0 15px 0; color: #374151;">Here’s how to get started:</p>
        <ul style="padding-left: 20px; margin: 0; color: #4b5563;">
          <li style="margin-bottom: 10px;">✨ Set up your profile</li>
          <li style="margin-bottom: 10px;">👥 Add contacts easily</li>
          <li style="margin-bottom: 10px;">💬 Start conversations</li>
          <li>📸 Share photos, videos, and more</li>
        </ul>
      </div>

      <p style="margin: 20px 0 5px;">Need help? We’re always here for you.</p>
      <p style="margin: 0;">Happy messaging! 💜</p>
      
      <p style="margin-top: 25px; margin-bottom: 0; font-weight: 600;">— The YapYard Team</p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">© 2025 YapYard. All rights reserved.</p>
    </div>
  </body>
  </html>
  `;
}


export function createOtpEmailTemplate(otp, isReset = false) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${isReset ? 'Reset Password - YapYard' : 'Verify Email - YapYard'}</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #fdf4ff;">
    
    <!-- Header -->
    <div style="background: linear-gradient(to right, #f59e0b, #ec4899, #8b5cf6); padding: 30px; text-align: center; border-radius: 16px 16px 0 0;">
      <h1 style="color: white; margin: 0; font-size: 26px; font-weight: 700;">${isReset ? '🔑 Password Reset' : '📧 Email Verification'}</h1>
    </div>

    <!-- Main Content -->
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 16px 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
      <p style="font-size: 18px; color: #8b5cf6; font-weight: 600; margin-top: 0;">Hello,</p>
      <p>${isReset ? 'You requested to reset your password.' : 'Please verify your email address.'}</p>

      <div style="text-align: center; margin: 25px 0;">
        <span style="font-size: 34px; font-weight: 800; color: #ec4899; letter-spacing: 4px; background: #fdf2f8; padding: 10px 20px; border-radius: 12px; display: inline-block;">${otp}</span>
      </div>

      <p>This OTP will expire in <strong>10 minutes</strong>.</p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; color: #9ca3af; font-size: 12px;">
      <p style="margin: 0;">© 2025 YapYard. All rights reserved.</p>
    </div>
  </body>
  </html>
  `;
}
