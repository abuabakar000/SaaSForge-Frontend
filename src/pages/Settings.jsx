import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { useNotification } from "../context/NotificationContext";
import { User, Lock, AlertTriangle, UploadCloud, ArrowRight, ShieldCheck } from "lucide-react";

const Settings = () => {
    const axiosPrivate = useAxiosPrivate();
    const { showNotification } = useNotification();

    const { setAuth } = useAuth();
    const [profileData, setProfileData] = useState({ username: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(true);
    const [updatingProfile, setUpdatingProfile] = useState(false);
    const [updatingPassword, setUpdatingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [avatarFile, setAvatarFile] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const isPasswordFormValid =
        passwordData.currentPassword.trim() !== '' &&
        passwordData.newPassword.trim() !== '' &&
        passwordData.confirmPassword.trim() !== '';

    useEffect(() => {
        let isMounted = true;
        const fetchProfile = async () => {
            try {
                const response = await axiosPrivate.get('/users/me');
                if (isMounted) {
                    setProfileData({
                        username: response.data.username || '',
                        email: response.data.email || ''
                    });
                    if (response.data.avatarUrl) {
                        setAvatarPreview(response.data.avatarUrl);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch profile", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchProfile();

        return () => { isMounted = false; };
    }, [axiosPrivate]);

    const handleProfileChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        setUpdatingProfile(true);

        const formData = new FormData();
        formData.append('username', profileData.username);
        formData.append('email', profileData.email);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const response = await axiosPrivate.put('/users/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setAuth(prev => ({
                ...prev,
                user: response.data.username,
                avatarUrl: response.data.avatarUrl
            }));
            showNotification('Profile identity synchronized successfully.');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Profile sync failed. Protocol error.', 'error');
        } finally {
            setUpdatingProfile(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return showNotification('Security check failed: New passwords do not match!', 'error');
        }

        setUpdatingPassword(true);
        try {
            await axiosPrivate.put('/users/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            showNotification('Security protocol updated. Key recalibrated.');
        } catch (err) {
            showNotification(err.response?.data?.message || 'Password update failed. Authentication error.', 'error');
        } finally {
            setUpdatingPassword(false);
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = async () => {
        setDeletingAccount(true);
        try {
            await axiosPrivate.delete('/users');
            window.location.href = '/login'; // Force full refresh to clear all states
        } catch (err) {
            showNotification('Nullification failed. Admin override required.', 'error');
            setShowDeleteModal(false);
        } finally {
            setDeletingAccount(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 shadow-lg shadow-indigo-500/20"></div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in duration-700 max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-white tracking-tighter sm:text-5xl uppercase italic">
                        System Configuration<span className="text-indigo-500">.</span>
                    </h1>
                    <p className="text-slate-500 mt-2 font-medium">Manage your identity profile and security protocols.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                {/* Left Column: Forms */}
                <div className="lg:col-span-2 space-y-10">
                    {/* 1. Profile Settings */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] premium-shadow overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-slate-900/20">
                            <div className="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-400">
                                <User className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Profile Identity</h2>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleSaveProfile} className="space-y-8">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Username Handle</label>
                                        <input
                                            type="text"
                                            name="username"
                                            value={profileData.username}
                                            onChange={handleProfileChange}
                                            className="w-full px-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-medium transition-all"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Verified Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleProfileChange}
                                            className="w-full px-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-medium transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">Identity Avatar</label>
                                    <div className="flex items-center gap-6 p-6 bg-slate-950/30 rounded-[2rem] border border-white/5">
                                        <div className="w-20 h-20 rounded-full bg-slate-900 border-2 border-white/10 flex items-center justify-center overflow-hidden premium-shadow relative">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-transparent"></div>
                                            {avatarPreview ? (
                                                <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                            ) : (
                                                <User className="w-10 h-10 text-slate-700" />
                                            )}
                                        </div>
                                        <div className="space-y-3">
                                            <label className="cursor-pointer flex items-center gap-3 px-6 py-3 bg-white/5 hover:bg-white/10 text-xs font-black uppercase tracking-widest text-white rounded-xl border border-white/10 transition-all w-fit active:scale-95 shadow-lg">
                                                <UploadCloud className="w-4 h-4" />
                                                Update Visual
                                                <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                            </label>
                                            <p className="text-[10px] text-slate-600 font-bold tracking-tight">Recommended: PNG / JPG — Max 2MB.</p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={updatingProfile}
                                    className="px-10 py-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all flex items-center gap-2"
                                >
                                    {updatingProfile ? (
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    ) : null}
                                    {updatingProfile ? 'Syncing...' : 'Sync Profile Node'}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* 2. Change Password */}
                    <div className="bg-slate-900/40 backdrop-blur-md border border-white/5 rounded-[2.5rem] premium-shadow overflow-hidden">
                        <div className="p-8 border-b border-white/5 flex items-center gap-4 bg-slate-900/20">
                            <div className="p-2.5 bg-sky-500/10 rounded-xl text-sky-400">
                                <Lock className="w-5 h-5" />
                            </div>
                            <h2 className="text-xl font-bold text-white tracking-tight">Security Protocol</h2>
                        </div>
                        <div className="p-8">
                            <form onSubmit={handleUpdatePassword} className="space-y-6 max-w-md">
                                {[
                                    { label: 'Current Access Key', name: 'currentPassword' },
                                    { label: 'New Access Key', name: 'newPassword' },
                                    { label: 'Confirm New Key', name: 'confirmPassword' }
                                ].map((field) => (
                                    <div key={field.name} className="space-y-2">
                                        <label className="text-[10px] font-black uppercase text-slate-500 tracking-[0.2em] ml-1">{field.label}</label>
                                        <input
                                            type="password"
                                            name={field.name}
                                            value={passwordData[field.name]}
                                            onChange={handlePasswordChange}
                                            required
                                            className="w-full px-6 py-4 bg-slate-950/50 border border-white/5 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-white font-medium transition-all"
                                        />
                                    </div>
                                ))}

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        disabled={!isPasswordFormValid || updatingPassword}
                                        className={`w-full px-8 py-4 font-black uppercase tracking-[0.2em] text-[10px] rounded-2xl transition-all shadow-xl shadow-slate-950/20 active:scale-95 flex items-center justify-center gap-3 ${isPasswordFormValid
                                            ? 'bg-slate-800 hover:bg-slate-700 text-white'
                                            : 'bg-slate-900 text-slate-700 cursor-not-allowed border border-white/5'
                                            }`}
                                    >
                                        {updatingPassword ? (
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                        ) : null}
                                        {updatingPassword ? 'Recalibrating...' : 'Re-Verify Authentication'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Right Column: Info & Danger Zone */}
                <div className="space-y-10">
                    <div className="bg-indigo-600/5 p-8 rounded-[2.5rem] border border-indigo-500/20 shadow-xl space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-600/20">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-white text-lg">System Integrity</h3>
                        </div>
                        <p className="text-sm text-slate-400 font-medium leading-relaxed">
                            Your identity profile is strictly encrypted. Authentication protocols require high-frequency key verification for sensitive updates.
                        </p>
                        <ul className="space-y-3 pt-2">
                            {['Multi-node Verification', 'Neural Data Masking', 'Priority Support Path'].map(t => (
                                <li key={t} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-400">
                                    <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_#6366f1]"></span> {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-red-500/5 p-8 rounded-[2.5rem] border border-red-500/20 shadow-xl space-y-6">
                        <div className="flex items-center gap-3">
                            <AlertTriangle className="w-5 h-5 text-red-500" />
                            <h3 className="font-bold text-red-500">Danger Zone</h3>
                        </div>
                        <p className="text-xs text-slate-500 font-bold tracking-tight uppercase leading-relaxed italic">
                            Authorization for total system nullification. This action is irreversible once initialized.
                        </p>
                        <button
                            onClick={handleDeleteAccount}
                            className="w-full px-6 py-4 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white font-black uppercase tracking-widest text-[10px] border border-red-500/20 rounded-2xl transition-all active:scale-95"
                        >
                            Execute Nullification
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal remains visually similar for consistency */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="bg-slate-900 border border-white/10 rounded-[3rem] w-full max-w-md relative z-10 overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] premium-shadow p-10">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-red-500/20 flex items-center justify-center mb-6 border border-red-500/30">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <h3 className="text-3xl font-black text-white italic mb-4 tracking-tighter">Initialize Wipe?</h3>
                        <p className="text-slate-400 font-medium mb-8 leading-relaxed">
                            Are you certain about total account nullification? All project nodes and verified status will be purged.
                        </p>

                        <div className="bg-slate-950/50 rounded-2xl p-6 border border-white/5 mb-10 space-y-4">
                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">Wiping Targets:</p>
                            <ul className="text-xs text-slate-300 font-bold space-y-2 italic">
                                <li>• Identity profile & historical logs</li>
                                <li>• All initialized project discovery nodes</li>
                                <li>• Active subscription authorization</li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={confirmDeleteAccount}
                                disabled={deletingAccount}
                                className="w-full py-4 bg-red-500 hover:bg-red-400 text-white font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                            >
                                {deletingAccount ? (
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : null}
                                {deletingAccount ? 'Nullifying...' : 'Confirm Nullification'}
                            </button>
                            <button
                                onClick={() => !deletingAccount && setShowDeleteModal(false)}
                                disabled={deletingAccount}
                                className="w-full py-4 text-slate-500 hover:text-white font-bold tracking-tight transition-colors disabled:opacity-30"
                            >
                                Abort Protocol
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Settings;
