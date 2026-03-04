import { Link, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useLogout from '../hooks/useLogout';
import { LayoutDashboard, FolderKanban, CreditCard, Settings, ShieldAlert, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const navItems = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard, roles: ['user', 'admin'] },
    { label: 'Projects', path: '/projects', icon: FolderKanban, roles: ['user', 'admin'] },
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
        <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col h-screen sticky top-0">
            {/* Logo area */}
            <div className="h-16 flex items-center px-6 border-b border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl leading-none">S</span>
                    </div>
                    <span className="text-xl font-bold text-white tracking-tight">SaaSForge</span>
                </div>
            </div>

            {/* Navigation links */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navItems.map((item) => {
                    // Check if user has required role for this item
                    const hasAccess = item.roles.some(role => auth?.roles?.includes(role));
                    if (!hasAccess) return null;

                    const isActive = location.pathname === item.path ||
                        (item.path !== '/' && location.pathname.startsWith(item.path));

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-indigo-500/10 text-indigo-400'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                                }`}
                        >
                            <item.icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-slate-500'}`} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            {/* User profile & Logout */}
            <div className="p-4 border-t border-slate-800">
                <div className="flex items-center gap-3 px-3 py-3 mb-2 rounded-xl bg-slate-800/50 border border-slate-700/50">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold shadow-inner">
                        {auth?.user?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{auth?.user || 'User'}</p>
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">
                            {auth?.roles?.includes('admin') ? 'Admin' : 'Pro Plan'}
                        </p>
                    </div>
                </div>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                >
                    <LogOut className="w-5 h-5 text-slate-500 hover:text-red-400" />
                    Sign Out
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
