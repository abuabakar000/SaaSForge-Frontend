import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";
import { useNotification } from "../context/NotificationContext";
import { Lock, Mail, ArrowRight, ShieldCheck } from "lucide-react";
import logo from '../assets/logo.png';

const Login = () => {
    const { setAuth } = useAuth();
    const { showNotification } = useNotification();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await axios.post('/auth/login',
                { email, password },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );
            const userData = response?.data?.user;
            const accessToken = response?.data?.accessToken;
            setAuth({
                user: userData.username,
                roles: [userData.role],
                avatarUrl: userData.avatarUrl,
                accessToken
            });
            setEmail('');
            setPassword('');
            showNotification('System access authorized. Welcome back.');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setError('Neural connection failed. No server response.');
            } else if (err.response?.status === 400) {
                setError('Authentication incomplete: Missing credentials.');
            } else if (err.response?.status === 401) {
                setError('Identity mismatch: Unauthorized access.');
            } else {
                setError('Initialization sequence failed. Try again.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-[#0a0a0c]">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-[440px] relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="SaaSForge" className="h-20 w-auto object-contain" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Authorize Access<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Verify your neural credentials to continue.</p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 premium-shadow">
                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-8 text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                            <ShieldCheck className="w-4 h-4 shrink-0" /> {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Identity Email</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-medium transition-all placeholder-slate-700"
                                    placeholder="node@saas-core.io"
                                    autoComplete="off"
                                    onChange={(e) => setEmail(e.target.value)}
                                    value={email}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em]">Security Key</label>
                                <Link to="/forgot-password" title="Recover Access" className="text-[10px] font-black uppercase text-indigo-500/60 hover:text-indigo-400 tracking-widest transition-colors">Lost Key?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-medium transition-all placeholder-slate-700"
                                    placeholder="••••••••••••"
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {loading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>Verify Identity <ArrowRight className="w-4 h-4" /></>
                            )}
                        </button>
                    </form>
                </div>

                <div className="mt-10 text-center">
                    <p className="text-slate-500 font-medium">
                        New system entity? <Link to="/register" className="text-white hover:text-indigo-400 font-black uppercase tracking-widest text-[10px] ml-2 transition-colors">Initialize Registry</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Login;
