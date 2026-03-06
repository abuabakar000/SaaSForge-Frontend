import { useState, useEffect } from 'react';
import { Bell, Check, Trash2, ExternalLink, Info, Sparkles, AlertCircle, Calendar, ShieldCheck } from 'lucide-react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';

const NotificationsPage = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await axiosPrivate.get('/notifications');
            setNotifications(response.data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const markAsRead = async (id) => {
        try {
            await axiosPrivate.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const markAllRead = async () => {
        try {
            await axiosPrivate.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const deleteNotification = async (id) => {
        try {
            await axiosPrivate.delete(`/notifications/${id}`);
            setNotifications(notifications.filter(n => n._id !== id));
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <Sparkles className="w-5 h-5 text-emerald-400" />;
            case 'warning': return <AlertCircle className="w-5 h-5 text-amber-400" />;
            case 'promo': return <Sparkles className="w-5 h-5 text-indigo-400" />;
            default: return <Info className="w-5 h-5 text-blue-400" />;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl uppercase italic">
                        Neural Library<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium uppercase tracking-widest text-[10px]">Transmission History & System Alerts</p>
                </div>
                {notifications.length > 0 && (
                    <button
                        onClick={markAllRead}
                        className="flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-white rounded-xl border border-white/10 transition-all active:scale-95 shadow-xl group"
                    >
                        <Check className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                        Synchronize All Read
                    </button>
                )}
            </div>

            <div className="grid gap-6">
                {notifications.length === 0 ? (
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] p-20 text-center premium-shadow">
                        <div className="w-20 h-20 bg-slate-950/50 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
                            <Bell className="w-8 h-8 text-slate-800 opacity-20" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-400 uppercase tracking-widest leading-none mb-3">No Data Transmissions</h3>
                        <p className="text-slate-600 font-medium max-w-sm mx-auto">Your neural feed is currently silent. System alerts and project updates will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`group bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2rem] p-6 premium-shadow transition-all hover:bg-slate-900/60 relative overflow-hidden ${!notification.isRead ? 'ring-1 ring-indigo-500/30' : ''}`}
                            >
                                {!notification.isRead && (
                                    <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"></div>
                                )}
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="shrink-0">
                                        {getTypeIcon(notification.type)}
                                    </div>
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex items-center gap-3">
                                                <h3 className={`text-lg font-bold tracking-tight ${!notification.isRead ? 'text-white' : 'text-slate-400'}`}>
                                                    {notification.title}
                                                </h3>
                                                {!notification.isRead && (
                                                    <span className="px-2 py-0.5 bg-indigo-500 text-[8px] font-black text-white uppercase tracking-[0.2em] rounded-full shadow-lg">New</span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-[9px]">
                                                <Calendar className="w-3 h-3" />
                                                {new Date(notification.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                                            </div>
                                        </div>
                                        <p className={`text-sm leading-relaxed max-w-3xl ${!notification.isRead ? 'text-slate-300' : 'text-slate-500'}`}>
                                            {notification.message}
                                        </p>
                                        <div className="flex items-center gap-4 pt-2">
                                            {notification.link && (
                                                <Link
                                                    to={notification.link}
                                                    className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-500 text-[10px] font-black text-white uppercase tracking-widest rounded-xl hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20 active:scale-95"
                                                >
                                                    Access Node <ExternalLink className="w-3.5 h-3.5" />
                                                </Link>
                                            )}
                                            {!notification.isRead && (
                                                <button
                                                    onClick={() => markAsRead(notification._id)}
                                                    className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 hover:bg-white/10 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest rounded-xl border border-white/5 transition-all"
                                                >
                                                    <Check className="w-3.5 h-3.5" /> Mark Acknowledged
                                                </button>
                                            )}
                                            <button
                                                onClick={() => deleteNotification(notification._id)}
                                                className="ml-auto p-2.5 bg-red-500/5 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-xl border border-white/5 transition-all opacity-0 group-hover:opacity-100"
                                                title="Purge Record"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* System Status Footer */}
            <div className="pt-10 border-t border-white/5 flex items-center justify-between text-slate-600">
                <div className="flex items-center gap-3">
                    <ShieldCheck className="w-4 h-4 text-emerald-500/50" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Neural Encryption Active</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] italic">Protocols optimized for v2.0</p>
            </div>
        </div>
    );
};

export default NotificationsPage;
