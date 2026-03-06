import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { LayoutDashboard, FolderKanban, CreditCard, Settings, ShieldAlert, LogOut, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['user', 'admin'] },
    { label: 'Projects', path: '/projects', icon: FolderKanban, roles: ['user', 'admin'] },
    { label: 'Notifications', path: '/notifications', icon: Bell, roles: ['user', 'admin'] },
    { label: 'Billing', path: '/pricing', icon: CreditCard, roles: ['user', 'admin'] },
    { label: 'Settings', path: '/settings', icon: Settings, roles: ['user', 'admin'] },
    { label: 'Admin', path: '/admin', icon: ShieldAlert, roles: ['admin'] },
];

const Sidebar = () => {
    const { auth } = useAuth();
    const location = useLocation();
    const logout = useLogout();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="w-64 bg-slate-900/95 backdrop-blur-xl border-r border-slate-800/50 flex flex-col h-screen sticky top-0 z-50">
            {/* Logo area */}
            <div className="h-24 flex items-center px-6 mb-2">
                <Link to="/" className="group">
                    <img src={logo} alt="SaaSForge" className="h-14 w-auto object-contain transition-transform duration-300 group-hover:scale-105" />
                </Link>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
                {navItems.map((item) => {
                    const hasAccess = item.roles.some(role => auth?.roles?.includes(role));
                    if (!hasAccess) return null;

                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${isActive
                                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-500/5'
                                : 'text-slate-400 hover:text-slate-100 hover:bg-white/5 border border-transparent'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User profile & Logout */}
            <div className="p-4 p-b-8 border-t border-slate-800/50 bg-slate-900/50">
                <div className="flex items-center gap-3 px-3 py-3 mb-4 rounded-2xl bg-slate-800/40 border border-slate-700/30 group cursor-default">
                    <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-tr from-indigo-500 to-emerald-500 rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                        <div className="w-10 h-10 relative rounded-full bg-slate-700 border border-white/10 flex items-center justify-center text-white font-bold text-lg shadow-xl overflow-hidden">
                            {auth?.avatarUrl ? (
                                <img src={auth.avatarUrl} alt={auth.user} className="w-full h-full object-cover" />
                            ) : (
                                auth?.user?.charAt(0).toUpperCase() || 'U'
                            )}
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-100 truncate">{auth?.user || 'User'}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest leading-none">
                                {auth?.roles?.includes('admin') ? 'ADMIN NODE' : 'FREE PLAN'}
                            </p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-slate-400 hover:text-red-400 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-300"
                >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
