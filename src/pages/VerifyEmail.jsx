import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from '../api/axios';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
    const [message, setMessage] = useState('');
    const hasFired = useRef(false);

    useEffect(() => {
        // Prevent double API call in React 18 Strict Mode
        if (hasFired.current) return;
        hasFired.current = true;

        const verifyEmailToken = async () => {
            try {
                const response = await axios.get(`/auth/verify/${token}`);
                setStatus('success');
                setMessage(response.data.message || 'Email verified successfully!');
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed. The link may be invalid or expired.');
            }
        };

        if (token) {
            verifyEmailToken();
        } else {
            setStatus('error');
            setMessage('No verification token provided.');
        }
    }, [token]);

    return (
        <section className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
            <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl text-center">

                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="w-16 h-16 text-indigo-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Email...</h2>
                        <p className="text-slate-400">Please wait while we verify your email address.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Email Verified!</h2>
                        <p className="text-slate-400 mb-8">{message}</p>
                        <Link
                            to="/login"
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all active:scale-95"
                        >
                            Continue to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6">
                            <XCircle className="w-10 h-10 text-red-500" />
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
                        <p className="text-slate-400 mb-8">{message}</p>
                        <Link
                            to="/login"
                            className="w-full text-indigo-400 hover:text-indigo-300 font-medium transition-colors"
                        >
                            Return to Login Page
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
};

export default VerifyEmail;
