import prisma from '../utils/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { sendOtpEmail } from '../utils/email.js';

export const register = async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const password_hash = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { email, password_hash, role }
        });
        res.json({ success: true, userId: user.id });
    } catch (error) {
        res.status(400).json({ error: 'Registration failed. Email might be taken.' });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires_at = new Date(Date.now() + 5 * 60000);

    await prisma.otpCode.create({
        data: { user_id: user.id, otp, expires_at }
    });

    await sendOtpEmail(email, otp);

    res.json({ message: 'otp_sent' });
};

export const verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const validOtp = await prisma.otpCode.findFirst({
        where: {
            user_id: user.id,
            otp,
            expires_at: { gt: new Date() }
        },
        orderBy: { created_at: 'desc' }
    });

    // BYPASS OTP for user request
    // if (!validOtp) return res.status(400).json({ error: 'Invalid or expired OTP' });

    // Auto login regardless of OTP
    const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );

    res.json({ jwt_token: token, role: user.role });
};
