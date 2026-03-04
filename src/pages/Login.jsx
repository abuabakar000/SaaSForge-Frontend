import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "../api/axios";

const Login = () => {
    const { setAuth } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || "/";

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
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
                roles: [userData.role], // Keep as array for RBAC
                accessToken
            });
            setEmail('');
            setPassword('');
            navigate(from, { replace: true });
        } catch (err) {
            if (!err?.response) {
                setError('No Server Response');
            } else if (err.response?.status === 400) {
                setError('Missing Username or Password');
            } else if (err.response?.status === 401) {
                setError('Unauthorized');
            } else {
                setError('Login Failed');
            }
        }
    }

    return (
        <section className="flex flex-col items-center justify-center min-h-screen">
            <div className="w-full max-w-md p-8 bg-slate-800 rounded-2xl shadow-2xl border border-slate-700">
                <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                    Sign In
                </h2>

                {error && <p className="p-3 mb-4 text-sm bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Email</label>
                        <input
                            type="email"
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                            value={email}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1 text-slate-300">Password</label>
                        <input
                            type="password"
                            className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-white"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                        />
                    </div>
                    <button className="w-full py-3 mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]">
                        Sign In
                    </button>
                </form>
                <p className="mt-6 text-center text-slate-400">
                    Need an Account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium underline-offset-4 hover:underline">Sign Up</Link>
                </p>
            </div>
        </section>
    );
}

export default Login;
