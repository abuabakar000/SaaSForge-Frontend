import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";
import { Mail, ArrowRight, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNotification } from "../context/NotificationContext";
import logo from '../assets/logo.png';

const ForgotPassword = () => {
    const { showNotification } = useNotification();
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await axios.post('/auth/forgotpassword', { email });
            setStatus('success');
            const msg = response.data.message || 'If an account exists with that email, a reset link has been sent.';
            setMessage(msg);
            showNotification(msg);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Neural link failed. Please retry.');
        }
    };

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
                        Recover Access<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-500 font-medium px-4">Initialize the identity restoration protocol.</p>
                </div>

                {/* Form Card */}
                <div className="bg-slate-900/40 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 premium-shadow">
                    {status === 'success' ? (
                        <div className="text-center space-y-6 animate-in fade-in zoom-in duration-500">
                            <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                                <ShieldCheck className="w-10 h-10 text-emerald-500" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-white italic">Protocol Initiated</h3>
                                <p className="text-slate-400 text-sm font-medium leading-relaxed">{message}</p>
                            </div>
                            <Link
                                to="/login"
                                className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all active:scale-95"
                            >
                                <ArrowLeft className="w-4 h-4" /> Return to Access Port
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <p className="text-slate-400 text-xs font-medium leading-relaxed mb-2 opacity-80">
                                Enter your verified email node to receive a one-time cryptographic reset link.
                            </p>

                            {status === 'error' && (
                                <div className="flex items-center gap-3 p-4 mb-4 text-xs font-bold bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl animate-in slide-in-from-top-2 duration-300">
                                    <ShieldCheck className="w-4 h-4 shrink-0" /> {message}
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Verified Email</label>
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

                            <button
                                disabled={status === 'loading'}
                                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-xs rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {status === 'loading' ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>Transmit Reset Link <ArrowRight className="w-4 h-4" /></>
                                )}
                            </button>

                            <div className="pt-2 text-center">
                                <Link to="/login" className="text-[10px] font-black uppercase text-slate-500 hover:text-white tracking-widest transition-colors flex items-center justify-center gap-2">
                                    <ArrowLeft className="w-3 h-3" /> Abort and Return
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ForgotPassword;
