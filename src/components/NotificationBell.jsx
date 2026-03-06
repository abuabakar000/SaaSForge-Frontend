import { useState, useEffect, useRef } from 'react';
import { Bell, Check, Trash2, ExternalLink, Info, Sparkles, AlertCircle } from 'lucide-react';
import useAxiosPrivate from '../hooks/useAxiosPrivate';
import { Link } from 'react-router-dom';

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const axiosPrivate = useAxiosPrivate();
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const response = await axiosPrivate.get('/notifications');
            setNotifications(response.data);
            setUnreadCount(response.data.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every minute
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const markAsRead = async (id) => {
        try {
            await axiosPrivate.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read', err);
        }
    };

    const markAllRead = async () => {
        try {
            await axiosPrivate.put('/notifications/read-all');
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Failed to mark all as read', err);
        }
    };

    const deleteNotification = async (id, e) => {
        e.stopPropagation();
        try {
            await axiosPrivate.delete(`/notifications/${id}`);
            const updated = notifications.filter(n => n._id !== id);
            setNotifications(updated);
            setUnreadCount(updated.filter(n => !n.isRead).length);
        } catch (err) {
            console.error('Failed to delete notification', err);
        }
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case 'success': return <Sparkles className="w-4 h-4 text-emerald-400" />;
            case 'warning': return <AlertCircle className="w-4 h-4 text-amber-400" />;
            case 'promo': return <Sparkles className="w-4 h-4 text-indigo-400" />;
            default: return <Info className="w-4 h-4 text-blue-400" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`relative p-2.5 rounded-xl border transition-all duration-300 active:scale-95 ${isOpen
                    ? 'bg-indigo-500/10 border-indigo-500/50 text-white shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                    : 'bg-white/5 border-white/5 text-slate-400 hover:text-white hover:border-white/10 hover:bg-white/10'
                    }`}
            >
                <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-none' : ''}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 bg-indigo-500 text-[10px] font-black text-white rounded-full border-2 border-[#0b0f1a] flex items-center justify-center animate-bounce">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-4 w-80 sm:w-96 bg-[#0f172a] border border-white/10 rounded-[2rem] shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="p-6 border-b border-white/5 bg-slate-900/40 flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Notifications</h3>
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight mt-1">Status: Operational</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllRead}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors group"
                                title="Mark all as read"
                            >
                                <Check className="w-4 h-4 text-slate-500 group-hover:text-emerald-400" />
                            </button>
                        )}
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length === 0 ? (
                            <div className="p-10 text-center">
                                <Bell className="w-8 h-8 text-slate-800 mx-auto mb-3 opacity-20" />
                                <p className="text-xs font-bold text-slate-600 uppercase tracking-widest">Awaiting Transmission...</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-white/5">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => !notification.isRead && markAsRead(notification._id)}
                                        className={`p-5 hover:bg-white/[0.02] transition-colors cursor-pointer relative group ${!notification.isRead ? 'bg-indigo-500/5' : ''}`}
                                    >
                                        <div className="flex gap-4">
                                            <div className="mt-1 shrink-0">
                                                {getTypeIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between gap-2 mb-1">
                                                    <h4 className={`text-xs font-black uppercase tracking-tight truncate ${!notification.isRead ? 'text-white' : 'text-slate-400'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    <span className="text-[9px] font-bold text-slate-600 shrink-0">
                                                        {new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                                    </span>
                                                </div>
                                                <p className={`text-xs leading-relaxed line-clamp-2 ${!notification.isRead ? 'text-slate-300' : 'text-slate-500'}`}>
                                                    {notification.message}
                                                </p>
                                                {notification.link && (
                                                    <Link
                                                        to={notification.link}
                                                        className="mt-3 inline-flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest hover:text-indigo-300 transition-colors"
                                                    >
                                                        Access Node <ExternalLink className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </div>
                                            <button
                                                onClick={(e) => deleteNotification(notification._id, e)}
                                                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 text-slate-600 hover:text-red-400 rounded-lg transition-all"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <Link
                        to="/notifications"
                        onClick={() => setIsOpen(false)}
                        className="block p-4 bg-slate-900/60 border-t border-white/5 text-center text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-[0.2em] transition-all hover:bg-slate-900"
                    >
                        View Full History
                    </Link>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
