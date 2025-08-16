import express from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // <-- use your app password here
  },
});

// Route to test email
app.get("/send-test", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Test Server" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself
      subject: "✅ Gmail App Password Test",
      text: "If you see this, your Gmail app password works!",
    });

    res.json({ success: true, message: "Test email sent!" });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
});
