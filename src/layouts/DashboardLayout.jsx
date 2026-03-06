import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import NotificationBell from '../components/NotificationBell';
import NotificationBar from '../components/NotificationBar';
import useAuth from '../hooks/useAuth';
import { ChevronRight, Bell } from 'lucide-react';

const DashboardLayout = () => {
    const { auth } = useAuth();
    const location = useLocation();

    // Simple breadcrumb logic
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const currentPage = pathSegments.length > 0
        ? pathSegments[0].charAt(0).toUpperCase() + pathSegments[0].slice(1)
        : 'Overview';

    return (
        <div className="flex h-screen bg-[#0b0f1a] overflow-hidden">
            <NotificationBar />
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Subtle Glow Effect */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none"></div>

                {/* Top Bar */}
                <header className="h-20 flex items-center justify-between px-8 bg-slate-900/40 backdrop-blur-xl border-b border-white/5 z-40">
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-slate-500 hover:text-slate-300 transition-colors cursor-default font-medium">Platform</span>
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                        <span className="text-indigo-400 font-bold tracking-tight">{currentPage}</span>
                    </div>

                    <div className="flex items-center gap-6">
                        <NotificationBell />
                        <div className="h-8 w-px bg-white/10"></div>
                        <div className="text-right hidden sm:block px-2">
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] leading-none mb-1">Authenticated as</p>
                            <p className="text-sm font-bold text-white tracking-tight">{auth?.user || 'Guest'}</p>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto relative scroll-smooth bg-transparent">
                    <div className="min-h-full p-8">
                        <div className="max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
