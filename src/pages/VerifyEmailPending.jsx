import { useState, useEffect } from 'react';
import { Mail, Send } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import useAxiosPrivate from '../hooks/useAxiosPrivate';

const VerifyEmailPending = () => {
    const location = useLocation();
    const email = location.state?.email || 'your email';
    const axiosPrivate = useAxiosPrivate();

    const [isEmailSent, setIsEmailSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleSendEmail = async () => {
        if (countdown > 0) return;
        setIsSending(true);
        setError('');

        try {
            await axiosPrivate.post('/auth/send-verification-email');
            setIsEmailSent(true);
            setCountdown(60);
        } catch (err) {
            setError(err?.response?.data?.message || 'Failed to send verification email');
        } finally {
            setIsSending(false);
        }
    };

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                        {isEmailSent ? <Mail className="w-10 h-10 text-indigo-500" /> : <Send className="w-10 h-10 text-indigo-500" />}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">
                        {isEmailSent ? 'Check your email' : 'Verify your email'}
                    </h2>

                    <p className="text-slate-400 mb-6">
                        {isEmailSent ? (
                            <>
                                We sent a verification link to <span className="text-white font-medium">{email}</span>.
                                Please check your inbox (and spam folder) to verify your account.
                            </>
                        ) : (
                            <>
                                Secure your account by verifying your email address: <span className="text-white font-medium">{email}</span>.
                            </>
                        )}
                    </p>

                    {error && <p className="mb-4 text-sm bg-red-500/10 text-red-500 rounded-lg p-2">{error}</p>}

                    <div className="w-full space-y-3 mt-2">
                        {!isEmailSent ? (
                            <button
                                onClick={handleSendEmail}
                                disabled={isSending}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-center"
                            >
                                {isSending ? 'Sending...' : 'Verify Email'}
                            </button>
                        ) : (
                            <button
                                onClick={handleSendEmail}
                                disabled={countdown > 0 || isSending}
                                className="w-full bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed font-bold py-3 px-4 rounded-xl transition-all text-center border border-indigo-500/30"
                            >
                                {countdown > 0 ? `Resend in ${countdown}s` : (isSending ? 'Sending...' : 'Resend Email')}
                            </button>
                        )}

                        <Link
                            to="/"
                            className="block w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-center"
                        >
                            I'll do it later
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default VerifyEmailPending;
