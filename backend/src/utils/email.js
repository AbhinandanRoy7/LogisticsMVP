import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD
    }
});

export const sendOtpEmail = async (email, otp) => {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: process.env.SMTP_EMAIL,
            to: email,
            subject: 'Logistics Dashboard OTP',
            text: `Your OTP is: ${otp}`
        });
    } catch (error) {
        console.error("Email sending failed:", error);
        // Fallback for dev/demo if email fails (often gmail blocks uncertain logins)
        console.log(`[FALLBACK] OTP for ${email}: ${otp}`);
    }
};
