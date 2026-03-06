import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { User, CreditCard, Activity, Lock, ArrowRight, CheckCircle2, Package, Database, KeySquare, PlusCircle, Settings as SettingsIcon, ExternalLink, Github, Clock, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const Dashboard = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();

    const [profile, setProfile] = useState(null);
    const [usage, setUsage] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        const getDashboardData = async () => {
            try {
                // Fetch Profile, Usage, and Projects concurrently
                const [profileRes, usageRes, projectsRes] = await Promise.all([
                    axiosPrivate.get('/users/me', { signal: controller.signal }),
                    axiosPrivate.get('/users/usage', { signal: controller.signal }),
                    axiosPrivate.get('/projects', { signal: controller.signal })
                ]);

                if (isMounted) {
                    setProfile(profileRes.data);
                    setUsage(usageRes.data);
                    setProjects(projectsRes.data);
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

    // Process data for charts
    const trendData = projects.length > 0 ? (() => {
        const dates = {};
        // Get last 7 days
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            dates[d.toISOString().split('T')[0]] = 0;
        }

        projects.forEach(p => {
            const date = p.createdAt.split('T')[0];
            if (dates[date] !== undefined) {
                dates[date]++;
            }
        });

        return Object.keys(dates).map(date => ({
            name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            projects: dates[date]
        }));
    })() : [];

    const usagePieData = usage ? [
        { name: 'Used', value: usage.projects.used, color: '#38bdf8' },
        { name: 'Remaining', value: Math.max(0, usage.projects.limit - usage.projects.used), color: '#1e293b' }
    ] : [];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    const isPro = auth?.roles?.includes('admin'); // Assuming 'admin' acts as our Pro tier flag for now

    return (
        <div className="space-y-10 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl">
                        Dashboard<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium flex items-center gap-2">
                        System status: <span className="text-emerald-500 flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Operational</span>
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link to="/projects" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 transition-all flex items-center gap-2">
                        <PlusCircle className="w-5 h-5" /> New Project
                    </Link>
                </div>
            </div>

            {/* Row 1: Profile & Quick Stats Overlay */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Profile Card */}
                <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 relative overflow-hidden group premium-shadow">
                    <div className="absolute top-0 right-0 p-8 text-slate-800/20 group-hover:text-indigo-500/10 transition-colors duration-700">
                        <User className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                        <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em] mb-4">Identity Profile</p>
                            <h3 className="text-2xl font-bold text-white tracking-tight leading-tight">{profile?.username || auth.user}</h3>
                            <p className="text-slate-400 text-sm mt-1 mb-6 font-medium">{profile?.email}</p>
                        </div>
                        <button className="w-fit flex items-center gap-2 text-xs font-black text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                            Edit Profile <ArrowRight className="w-3 h-3" />
                        </button>
                    </div>
                </div>

                {/* 2. Subscription Card */}
                <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 relative overflow-hidden premium-shadow group">
                    <div className="absolute top-0 right-0 p-8 text-slate-800/20 group-hover:text-emerald-500/10 transition-colors duration-700">
                        <CreditCard className="w-24 h-24" />
                    </div>
                    <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                        <div>
                            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.2em] mb-4">Subscription Plan</p>
                            <h3 className={`text-4xl font-black italic tracking-tighter ${isPro ? 'text-indigo-400' : 'text-slate-200'}`}>
                                {isPro ? 'PRO TIER' : 'BASIC TIER'}
                            </h3>
                            <p className="text-slate-500 text-xs mt-3 font-bold uppercase tracking-widest">
                                Status: <span className="text-emerald-500 italic">Active</span>
                            </p>
                        </div>
                        <Link to="/pricing" className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-xl border border-white/5 transition-all">
                            {isPro ? 'Manage Billing' : 'Upgrade Plan'}
                        </Link>
                    </div>
                </div>

                {/* 3. Global Stats */}
                <div className="bg-indigo-600 p-8 rounded-[2rem] border border-indigo-500 shadow-2xl shadow-indigo-600/20 relative overflow-hidden flex flex-col justify-between text-white group">
                    <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:scale-110 transition-transform duration-1000">
                        <Activity className="w-48 h-48" />
                    </div>
                    <div className="relative z-10">
                        <p className="text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em] mb-4">System Efficiency</p>
                        <h3 className="text-5xl font-black tracking-tighter">98<span className="text-indigo-300 text-3xl italic">%</span></h3>
                        <p className="text-indigo-100 text-xs mt-2 font-medium">Uptime maintained throughout last 30 days.</p>
                    </div>
                    <div className="mt-8 flex items-center gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-indigo-600 bg-indigo-400"></div>)}
                        </div>
                        <span className="text-[10px] font-bold tracking-tight">Real-time pulse verified</span>
                    </div>
                </div>
            </div>

            {/* Row 2: Visualized Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 4. Development Analytics */}
                <div className="lg:col-span-2 bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-xl font-bold text-white tracking-tight">Project Momentum</h3>
                            <p className="text-xs text-slate-500 uppercase tracking-widest font-black mt-1">Last 7 Development Cycles</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-950/50 rounded-lg border border-white/5">
                            <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                            <span className="text-[10px] font-bold text-slate-300">Live Feed</span>
                        </div>
                    </div>
                    <div className="h-[280px] w-full mt-4">
                        {trendData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={trendData}>
                                    <defs>
                                        <linearGradient id="colorProjects" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="0" stroke="#ffffff08" vertical={false} />
                                    <XAxis
                                        dataKey="name"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 700 }}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #ffffff10', borderRadius: '16px', backdropFilter: 'blur(10px)', fontSize: '10px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                        itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="projects"
                                        stroke="#818cf8"
                                        strokeWidth={4}
                                        fillOpacity={1}
                                        fill="url(#colorProjects)"
                                        animationDuration={2000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-full text-slate-500 border-2 border-dashed border-white/5 rounded-3xl">
                                <Package className="w-12 h-12 mb-4 opacity-10" />
                                <p className="text-sm font-black uppercase tracking-widest text-slate-600">Pending Development</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* 5. Resource Distribution */}
                <div className="bg-slate-900/40 backdrop-blur-md p-8 rounded-[2rem] border border-white/5 shadow-xl flex flex-col items-center">
                    <div className="w-full mb-8">
                        <h3 className="text-xl font-bold text-white tracking-tight text-center">Cloud Quota</h3>
                        <p className="text-[10px] text-slate-500 text-center uppercase tracking-widest font-black mt-1">Resource allocation index</p>
                    </div>

                    <div className="relative w-full aspect-square max-w-[200px] mb-8">
                        {usagePieData.length > 0 && usage?.projects.limit > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={usagePieData}
                                        innerRadius="75%"
                                        outerRadius="100%"
                                        paddingAngle={8}
                                        dataKey="value"
                                        stroke="none"
                                        startAngle={90}
                                        endAngle={450}
                                        animationBegin={500}
                                        animationDuration={1500}
                                    >
                                        {usagePieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="w-full h-full rounded-full border-4 border-dashed border-white/5 flex items-center justify-center opacity-20">
                                <Activity className="w-10 h-10" />
                            </div>
                        )}
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <span className="text-4xl font-black text-white italic">{usage?.projects.used || 0}</span>
                            <span className="text-[10px] uppercase font-black text-slate-500 tracking-widest mt-1">Slots</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 w-full">
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Used</p>
                            <p className="text-lg font-bold text-white">{usage?.projects.used || 0}</p>
                        </div>
                        <div className="bg-slate-950/50 p-4 rounded-2xl border border-white/5">
                            <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Limit</p>
                            <p className="text-lg font-bold text-white">{usage?.projects.limit || 0}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Row 3: Technical Details/Logs */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Usage Limits */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center gap-2 px-1">
                        <Activity className="w-4 h-4 text-indigo-400" />
                        <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Service Statistics</h3>
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/5 p-8 space-y-10 shadow-xl">
                        {[
                            { label: 'Network Operations', used: usage?.projects.used, limit: usage?.projects.limit, color: 'bg-indigo-500' },
                            { label: 'Data Throughput', used: usage?.apiCalls.used, limit: usage?.apiCalls.limit, color: 'bg-sky-400' },
                            { label: 'Neural Storage', used: usage?.storage.used, limit: usage?.storage.limit, color: 'bg-emerald-400', isStorage: true }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-4">
                                <div className="flex justify-between items-end">
                                    <span className="text-xs font-bold text-slate-200">{stat.label}</span>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest block mb-0.5">Utilization</span>
                                        <span className="text-sm font-black italic text-white">{stat.used}{stat.isStorage ? 'GB' : ''} / {stat.limit}{stat.isStorage ? 'GB' : ''}</span>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden p-[2px] border border-white/5">
                                    <div
                                        className={`h-full ${stat.color} transition-all duration-1000 shadow-[0_0_10px_rgba(99,102,241,0.5)]`}
                                        style={{ width: `${Math.min(100, (stat.used / stat.limit) * 100)}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="lg:col-span-3 space-y-4">
                    <div className="flex items-center justify-between px-1">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-indigo-400" />
                            <h3 className="text-sm font-black uppercase text-slate-400 tracking-[0.2em]">Event Ledger</h3>
                        </div>
                        <Link to="/projects" className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors">Audit Full History</Link>
                    </div>
                    <div className="bg-slate-900/40 backdrop-blur-md rounded-[2rem] border border-white/5 shadow-xl flex-1 min-h-[400px]">
                        {projects.length > 0 ? (
                            <div className="divide-y divide-white/5">
                                {projects.slice(0, 4).map((project) => (
                                    <div key={project._id} className="p-6 flex items-center justify-between group hover:bg-white/5 transition-all duration-300 first:rounded-t-[2rem] last:rounded-b-[2rem]">
                                        <div className="flex items-center gap-5">
                                            <div className="w-16 h-12 bg-slate-950 rounded-2xl border border-white/5 overflow-hidden flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500 shadow-inner">
                                                {project.images?.[0] ? <img src={project.images[0]} className="w-full h-full object-cover opacity-40 group-hover:opacity-100 transition-opacity" /> : <Layers className="w-6 h-6 text-slate-700" />}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-bold text-slate-100 group-hover:text-white transition-colors">{project.name}</h4>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider italic">Refined {new Date(project.updatedAt).toLocaleDateString()}</p>
                                                    <span className="w-1 h-1 rounded-full bg-slate-700"></span>
                                                    <span className="text-[10px] font-black text-indigo-400/50 uppercase tracking-tighter">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-2 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                                            <Link to="/projects" state={{ editProjectId: project._id }} className="px-5 py-2 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/10 active:scale-95">Edit Event</Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-20 text-center flex flex-col items-center">
                                <Package className="w-20 h-20 text-slate-800 mb-6 opacity-40" />
                                <p className="text-lg font-bold text-white mb-2 italic">Ledger Nullified</p>
                                <p className="text-sm text-slate-500 max-w-[240px] mb-10">No recent development events have been authorized by the system yet.</p>
                                <Link to="/projects/new" className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-xs font-black uppercase tracking-widest rounded-2xl border border-white/10 transition-all active:scale-95">Initialize Project Node</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
