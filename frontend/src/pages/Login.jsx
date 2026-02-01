import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Label } from '../components/ui/label';

const API_URL = 'http://localhost:3000';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('login');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleRegister = async () => {
        // Quick register for demo
        try {
            await axios.post(`${API_URL}/auth/register`, { email, password, role: 'ADMIN' }); // Defaulting to ADMIN for MVP demo convenience
            alert('Registered! Now login.');
        } catch (err) {
            alert('Registration failed or user exists');
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/auth/login`, { email, password });
            setStep('otp');
        } catch (err) {
            alert(err.response?.data?.error || 'Login failed. Try registering first?');
        }
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post(`${API_URL}/auth/verify-otp`, { email, otp });
            login(res.data.jwt_token, res.data.role);
            navigate('/dashboard');
        } catch (err) {
            alert(err.response?.data?.error || 'OTP verification failed');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Logistics Login</CardTitle>
                </CardHeader>
                <CardContent>
                    {step === 'login' ? (
                        <div className="space-y-4">
                            <form onSubmit={handleLogin} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input id="email" value={email} onChange={e => setEmail(e.target.value)} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                                </div>
                                <Button type="submit" className="w-full">Get OTP</Button>
                            </form>
                            <div className="text-center">
                                <button type="button" onClick={handleRegister} className="text-sm text-blue-500 underline">Register (Admin)</button>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="otp">Enter OTP</Label>
                                <Input id="otp" value={otp} onChange={e => setOtp(e.target.value)} required />
                            </div>
                            <p className="text-xs text-muted-foreground">Check server console for OTP if email not configured.</p>
                            <Button type="submit" className="w-full">Verify Login</Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
