import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "../api/axios";
import { Lock, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import logo from '../assets/logo.png';

const ResetPassword = () => {
    const { showNotification } = useNotification();
    const { token } = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setStatus('error');
            setMessage('Cryptography mismatch: Passwords do not match.');
            return;
        }

        setStatus('loading');
        try {
            const response = await axios.put(`/auth/resetpassword/${token}`, { password });
            setStatus('success');
            const msg = response.data.message || 'Password successfully recalibrated.';
            setMessage(msg);
            showNotification(msg);
            setTimeout(() => navigate('/login'), 4000);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Verification failed. Token may be expired.');
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen p-6 relative overflow-hidden bg-[#0a0a0c]">
            {/* Background Aesthetic */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
                <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full"></div>
            </div>

            <div className="w-full max-w-[460px] relative z-10">
                {/* Logo & Header */}
                <div className="text-center mb-10 space-y-4">
                    <div className="flex justify-center mb-6">
                        <img src={logo} alt="SaaSForge" className="h-20 w-auto object-contain" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                        Reset Identity<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-500 font-medium">Finalize your cryptographic key recalibration.</p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 premium-shadow">
                    {status === 'success' ? (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <CheckCircle2 className="w-10 h-10 text-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white italic">Key Re-Sync Complete</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{message}</p>
                            </div>
                            <div className="flex flex-col items-center gap-3">
                                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] animate-pulse">Redirecting to Access Port...</p>
                                <Link
                                    to="/login"
                                    className="text-xs font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors"
                                >
                                    Force Redirect
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {status === 'error' && (
                                <div className="flex items-center gap-3 p-4 mb-4 text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                                    <ShieldCheck className="w-4 h-4 shrink-0" /> {message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">New Access Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-medium transition-all placeholder-slate-700"
                                        placeholder="Min 6 characters"
                                        onChange={(e) => setPassword(e.target.value)}
                                        value={password}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Confirm New Key</label>
                                <div className="relative">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                                    <input
                                        type="password"
                                        className="w-full pl-12 pr-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-medium transition-all placeholder-slate-700"
                                        placeholder="Repeat new key"
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        value={confirmPassword}
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>

                            <button
                                disabled={status === 'loading'}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {status === 'loading' ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>Recalibrate Identity <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>

                            <div className="pt-2 text-center">
                                <Link to="/login" className="text-[10px] font-black uppercase text-slate-500 hover:text-white tracking-widest transition-colors">
                                    Abort and Return to Port
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ResetPassword;
