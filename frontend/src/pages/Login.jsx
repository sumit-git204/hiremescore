import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Bot, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
    const navigate = useNavigate();
    const [error, setError] = useState(null);

    const handleLogin = async () => {
        setError(null);
        try {
            await signInWithPopup(auth, googleProvider);
            navigate('/dashboard');
        } catch (err) {
            console.error("Login failed", err);
            if (err.message?.includes("INTERNAL") || err.code === "auth/cancelled-popup-request" || err.message?.includes("dummy")) {
                setError("Firebase is not configured. Please add your config to frontend/.env");
            } else {
                setError(err.message || "Login failed. Please try again.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background glow effects */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-green/20 rounded-full blur-[100px] -z-10"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[100px] -z-10"></div>

            <div className="glass-card w-full max-w-md p-8 md:p-12 relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-dark-800 border border-neon-green flex items-center justify-center mb-6 neon-glow">
                        <Bot size={36} className="text-neon-green" />
                    </div>
                    <h1 className="text-3xl font-bold font-sans tracking-wider text-white mb-2">HIRE ME SCORE</h1>
                    <p className="text-gray-400 text-sm">AI Placement Readiness Evaluation</p>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-start gap-3">
                        <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={18} />
                        <p className="text-sm text-red-400">{error}</p>
                    </div>
                )}

                <div className="space-y-6">
                    <button
                        onClick={handleLogin}
                        className="w-full btn-primary group"
                    >
                        <LogIn className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        Sign in with Google
                    </button>

                    <div className="mt-8 text-center text-xs text-gray-500">
                        Secure authentication via Firebase
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
