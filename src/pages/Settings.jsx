import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { User, Lock, AlertTriangle, UploadCloud } from "lucide-react";

const Settings = () => {
    const axiosPrivate = useAxiosPrivate();

    const [profileData, setProfileData] = useState({ username: '', email: '' });
    const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    const [loading, setLoading] = useState(true);
    const [avatarPreview, setAvatarPreview] = useState(null);
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
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleSaveProfile = (e) => {
        e.preventDefault();
        alert('Profile Update Endpoint - Coming Soon!');
    };

    const handleUpdatePassword = (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            return alert("New passwords do not match!");
        }
        alert('Password Update Endpoint - Coming Soon!');
    };

    const handleDeleteAccount = () => {
        // Here we just trigger the modal instead of window.confirm
        setShowDeleteModal(true);
    };

    const confirmDeleteAccount = () => {
        alert('Account Deletion Endpoint - Coming Soon!');
        setShowDeleteModal(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    return (
        <section className="p-8 max-w-4xl mx-auto space-y-8">
            <header className="mb-4">
                <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
                <p className="text-slate-400">Manage your account preferences, security, and profile.</p>
            </header>

            {/* 1. Profile Settings */}
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex items-center gap-3 bg-slate-800/50">
                    <User className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Profile Settings</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleSaveProfile} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Username</label>
                                <input
                                    type="text"
                                    name="username"
                                    value={profileData.username}
                                    onChange={handleProfileChange}
                                    placeholder="e.g. johndoe"
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1.5 text-slate-300">Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={profileData.email}
                                    onChange={handleProfileChange}
                                    placeholder="john@example.com"
                                    className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-slate-300">Profile Picture (Optional)</label>
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center overflow-hidden">
                                    {avatarPreview ? (
                                        <img src={avatarPreview} alt="Avatar Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <User className="w-8 h-8 text-slate-600" />
                                    )}
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-sm font-medium text-white rounded-lg transition-colors w-fit">
                                        <UploadCloud className="w-4 h-4" />
                                        {avatarPreview ? 'Replace Image' : 'Upload Image'}
                                        <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                                    </label>
                                    <p className="text-xs text-slate-500">JPG, PNG or GIF. Max size 2MB.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button type="submit" className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg active:scale-95 transition-all">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 2. Change Password */}
            <div className="bg-slate-800/80 border border-slate-700/50 rounded-2xl shadow-xl overflow-hidden">
                <div className="p-6 border-b border-slate-700/50 flex items-center gap-3 bg-slate-800/50">
                    <Lock className="w-5 h-5 text-indigo-400" />
                    <h2 className="text-lg font-bold text-white">Change Password</h2>
                </div>
                <div className="p-6">
                    <form onSubmit={handleUpdatePassword} className="space-y-5 max-w-lg">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-slate-300">Current Password</label>
                            <input
                                type="password"
                                name="currentPassword"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                placeholder="Enter current password"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-slate-300">New Password</label>
                            <input
                                type="password"
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength="6"
                                placeholder="At least 6 characters"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 text-slate-300">Confirm Password</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                minLength="6"
                                placeholder="Confirm new password"
                                className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white placeholder-slate-500"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={!isPasswordFormValid}
                                className={`px-6 py-2.5 font-bold rounded-xl transition-all ${isPasswordFormValid
                                    ? 'bg-slate-700 hover:bg-slate-600 text-white cursor-pointer'
                                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                                    }`}
                            >
                                Update Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* 3. Danger Zone */}
            <div className="bg-red-900/10 border border-red-500/20 rounded-2xl shadow-xl overflow-hidden mt-12">
                <div className="p-6 border-b border-red-500/20 flex items-center gap-3 bg-red-500/5">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    <h2 className="text-lg font-bold text-red-500">Danger Zone</h2>
                </div>
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                        <h3 className="text-white font-bold mb-1">Delete Account</h3>
                        <p className="text-sm text-slate-400">
                            Permanently delete your account, projects, and active subscription. This action cannot be undone.
                        </p>
                    </div>
                    <button
                        onClick={handleDeleteAccount}
                        className="whitespace-nowrap px-6 py-2.5 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 active:scale-95 shadow-lg shadow-red-500/20 transition-all"
                    >
                        Delete My Account
                    </button>
                </div>
            </div>
            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm" onClick={() => setShowDeleteModal(false)}></div>
                    <div className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md relative z-10 overflow-hidden shadow-2xl">
                        <div className="p-6">
                            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 border border-red-500/20">
                                <AlertTriangle className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Delete Account</h3>
                            <p className="text-slate-400 mb-4">
                                Are you sure you want to delete your account? This action is permanent.
                            </p>

                            <div className="bg-slate-900/50 rounded-xl p-4 border border-slate-700/50 mb-6">
                                <p className="text-sm font-bold text-red-400 mb-2">This will permanently delete:</p>
                                <ul className="text-sm text-slate-300 space-y-2 list-disc list-inside">
                                    <li>Your profile and settings</li>
                                    <li>All created projects and images</li>
                                    <li>Your active subscription</li>
                                </ul>
                            </div>

                            <div className="flex gap-3 justify-end mt-6">
                                <button
                                    onClick={() => setShowDeleteModal(false)}
                                    className="px-5 py-2.5 rounded-xl font-medium text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={confirmDeleteAccount}
                                    className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Settings;
