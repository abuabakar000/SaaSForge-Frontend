import { useState } from "react";
import axios from "../api/axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // idle, loading, success, error
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        try {
            const response = await axios.post('/auth/forgotpassword', { email });
            setStatus('success');
            setMessage(response.data.message);
        } catch (err) {
            setStatus('error');
            setMessage(err.response?.data?.message || 'Failed to send reset email');
        }
    };

    return (
        <section className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Forgot Password
                </h2>

                {status === 'success' ? (
                    <div className="text-center">
                        <div className="mb-4 text-green-500 text-5xl">✓</div>
                        <p className="text-slate-300 mb-6">{message}</p>
                        <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-4 hover:underline">
                            Back to Login
                        </Link>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <p className="text-slate-400 text-sm mb-4">
                            Enter your email address and we'll send you a link to reset your password.
                        </p>
                        {status === 'error' && <p className="p-3 mb-4 text-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">{message}</p>}
                        <div>
                            <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                required
                            />
                        </div>
                        <button
                            disabled={status === 'loading'}
                            className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            {status === 'loading' ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
};

export default ForgotPassword;
