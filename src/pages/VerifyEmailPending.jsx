import { Mail } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const VerifyEmailPending = () => {
    const location = useLocation();
    const email = location.state?.email || 'your email';

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">
                <div className="flex flex-col items-center">
                    <div className="w-20 h-20 rounded-full bg-indigo-500/10 flex items-center justify-center mb-6">
                        <Mail className="w-10 h-10 text-indigo-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Check your email</h2>
                    <p className="text-slate-400 mb-6">
                        We sent a verification link to <span className="text-white font-medium">{email}</span>.
                        Please check your inbox (and spam folder) to verify your account.
                    </p>
                    <Link
                        to="/login"
                        className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95 text-center mt-2"
                    >
                        Return to Login
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default VerifyEmailPending;
