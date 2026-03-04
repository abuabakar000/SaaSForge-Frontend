import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { User, CreditCard, Activity, Lock, ArrowRight, CheckCircle2, Package, Database, KeySquare } from "lucide-react";
import { Link } from "react-router-dom";

const Dashboard = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [profile, setProfile] = useState(null);
    const [usage, setUsage] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getDashboardData = async () => {
            try {
                // Fetch Profile and Usage data concurrently
                const [profileRes, usageRes] = await Promise.all([
                    axiosPrivate.get('/users/me', { signal: controller.signal }),
                    axiosPrivate.get('/users/usage', { signal: controller.signal })
                ]);

                if (isMounted) {
                    setProfile(profileRes.data);
                    setUsage(usageRes.data);
                }
            } catch (err) {
                console.error("Error fetching dashboard data:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        getDashboardData();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [axiosPrivate]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const isPro = auth?.roles?.includes('admin'); // Assuming 'admin' acts as our Pro tier flag for now

    return (
        <section className="p-8 max-w-7xl mx-auto">
            <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-1 tracking-tight flex items-center gap-3">
                        Dashboard
                    </h1>
                    <p className="text-slate-400">Welcome back, <span className="text-indigo-400 font-semibold inline-block">{profile?.username || auth.user}</span>. Here's what's happening today.</p>
                </div>
            </header>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

                {/* 1. Profile Card */}
                <div className="bg-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                            <User className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Profile Details</h3>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Username</p>
                            <p className="text-slate-200 font-medium">{profile?.username}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Email Address</p>
                            <p className="text-slate-200 font-medium">{profile?.email}</p>
                        </div>
                        <div className="pt-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-700/50 text-slate-300 rounded-md text-xs font-medium border border-slate-600">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                Account Verified
                            </span>
                        </div>
                    </div>
                </div>

                {/* 2. Subscription Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-800/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-700/50 shadow-xl relative overflow-hidden group">
                    <div className="absolute -right-6 -top-6 text-slate-700/20 group-hover:text-slate-700/30 transition-colors">
                        <CreditCard className="w-32 h-32" />
                    </div>

                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2.5 bg-emerald-500/10 rounded-xl text-emerald-400">
                            <CreditCard className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Subscription</h3>
                    </div>

                    <div className="relative z-10 space-y-4">
                        <div>
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-1">Current Plan</p>
                            <div className="flex items-center gap-2">
                                <span className={`text-2xl font-black italic tracking-wide ${isPro ? 'text-indigo-400' : 'text-slate-200'}`}>
                                    {isPro ? 'PRO TIER' : 'FREE TIER'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 mt-2 border-t border-slate-700/50">
                            <div>
                                <p className="text-xs text-slate-400">Status</p>
                                <p className="text-sm font-medium text-emerald-400 flex items-center gap-1.5 mt-0.5">
                                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                                    Active
                                </p>
                            </div>

                            <Link to="/pricing" className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 group-hover:gap-2 transition-all">
                                {isPro ? 'Manage Billing' : 'Upgrade to Pro'} <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* 3. Locked Feature Card (Feature Gating Demo) */}
                <div className={`p-6 rounded-2xl border shadow-xl flex flex-col ${isPro ? 'bg-indigo-900/20 border-indigo-500/30' : 'bg-slate-800/40 border-slate-700/50 relative overflow-hidden'}`}>
                    {!isPro && (
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center p-6 text-center">
                            <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700 mb-3 shadow-lg">
                                <Lock className="w-5 h-5 text-slate-400" />
                            </div>
                            <h4 className="text-white font-bold mb-1">Pro Feature Locked</h4>
                            <p className="text-xs text-slate-400 mb-4">Upgrade to access Advanced Tools.</p>
                            <Link to="/pricing" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg shadow-lg active:scale-95 transition-all">
                                Unlock Now
                            </Link>
                        </div>
                    )}

                    <div className="flex items-center gap-3 mb-6 opacity-50">
                        <div className="p-2.5 bg-purple-500/10 rounded-xl text-purple-400">
                            <Activity className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-white">Advanced Tools</h3>
                    </div>

                    <div className="space-y-3 flex-1 opacity-50">
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" /> API Access Keys
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" /> Team Collaboration
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-300">
                            <CheckCircle2 className="w-4 h-4 text-purple-400" /> Priority Support
                        </div>
                    </div>

                    {isPro && (
                        <button className="mt-4 w-full py-2 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-sm font-semibold rounded-lg transition-colors">
                            Launch Tools
                        </button>
                    )}
                </div>
            </div>

            {/* 4. Usage Stats Full Width row */}
            {usage && (
                <div className="bg-slate-800/80 backdrop-blur-sm rounded-2xl border border-slate-700/50 shadow-xl overflow-hidden">
                    <div className="px-6 py-5 border-b border-slate-700/50 flex items-center gap-3">
                        <Activity className="w-5 h-5 text-sky-400" />
                        <h3 className="text-lg font-bold text-white">Resource Usage</h3>
                    </div>

                    <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-700/50">
                        {/* Stat Block 1 */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Package className="w-4 h-4" />
                                    <span className="text-sm font-medium">Projects Created</span>
                                </div>
                                <span className="text-sm font-bold text-white">{usage.projects.used} / {usage.projects.limit}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-sky-400 rounded-full"
                                    style={{ width: `${usage.projects.percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Stat Block 2 */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <KeySquare className="w-4 h-4" />
                                    <span className="text-sm font-medium">API Calls</span>
                                </div>
                                <span className="text-sm font-bold text-white">{usage.apiCalls.used.toLocaleString()} / {typeof usage.apiCalls.limit === 'number' ? usage.apiCalls.limit.toLocaleString() : usage.apiCalls.limit}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className={`h-full rounded-full ${usage.apiCalls.percentage > 80 ? 'bg-red-400' : 'bg-indigo-400'}`}
                                    style={{ width: `${usage.apiCalls.percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Stat Block 3 */}
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2 text-slate-400">
                                    <Database className="w-4 h-4" />
                                    <span className="text-sm font-medium">Storage Used</span>
                                </div>
                                <span className="text-sm font-bold text-white">{usage.storage.used}GB / {usage.storage.limit}GB</span>
                            </div>
                            <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-purple-400 rounded-full"
                                    style={{ width: `${usage.storage.percentage}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Dashboard;
