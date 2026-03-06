import { CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const NotificationBar = () => {
    const { notification, hideNotification } = useNotification();

    if (!notification.visible) return null;

    const isSuccess = notification.type === 'success';

    return (
        <div className={`fixed top-0 left-0 right-0 z-[9999] transform transition-transform duration-500 ease-in-out ${notification.visible ? 'translate-y-0' : '-translate-y-full'}`}>
            <div className={`flex items-center justify-between px-6 py-3 shadow-2xl backdrop-blur-md ${isSuccess ? 'bg-emerald-500/90 border-b border-emerald-400/20' : 'bg-red-500/90 border-b border-red-400/20'}`}>
                <div className="flex items-center gap-3">
                    {isSuccess ? (
                        <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                        <AlertCircle className="w-5 h-5 text-white" />
                    )}
                    <span className="text-sm font-bold text-white tracking-tight">{notification.message}</span>
                </div>
                <button
                    onClick={hideNotification}
                    className="p-1 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default NotificationBar;
