import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendOTPEmail = async (email: string, otp: string, fullName: string) => {
  const mailOptions = {
    from: `"Waterboard Inventory System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Login OTP Verification - Waterboard Inventory System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white;">Waterboard Inventory System</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Hello ${fullName},</h2>
          <p>You have requested to login to the Waterboard Inventory Management System.</p>
          <p>Your One-Time Password (OTP) for login is:</p>
          <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
            ${otp}
          </div>
          <p>This OTP is valid for <strong>10 minutes</strong>.</p>
          <p>If you didn't request this, please ignore this email.</p>
          <hr style="margin: 20px 0;" />
          <p style="color: #6b7280; font-size: 12px;">This is an automated message, please do not reply.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

export const sendWelcomeEmail = async (email: string, fullName: string) => {
  const mailOptions = {
    from: `"Waterboard Inventory System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Welcome to Waterboard Inventory System',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #2563eb; padding: 20px; text-align: center;">
          <h1 style="color: white;">Welcome to Waterboard Inventory System!</h1>
        </div>
        <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: none;">
          <h2>Hello ${fullName},</h2>
          <p>Your account has been successfully created in the Waterboard Inventory Management System.</p>
          <p>You can now login using your credentials:</p>
          <ul>
            <li><strong>Username:</strong> ${email}</li>
            <li><strong>Role:</strong> Viewer</li>
          </ul>
          <p>Please login and change your password for security purposes.</p>
          <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px;">
            Login to System
          </a>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};