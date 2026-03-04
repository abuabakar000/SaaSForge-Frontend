import { useState, useEffect } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                // In a real app, this would be a real admin route
                // For now, let's pretend we have a list
                const mockUsers = [
                    { id: 1, name: 'Abu Bakar', email: 'abu@example.com', role: 'admin', status: 'Active' },
                    { id: 2, name: 'John Doe', email: 'john@example.com', role: 'user', status: 'Active' },
                    { id: 3, name: 'Jane Smith', email: 'jane@example.com', role: 'user', status: 'Suspended' },
                ];
                setUsers(mockUsers);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return (
        <section className="p-8 max-w-6xl mx-auto">
            <header className="mb-12 flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2">Platform Admin</h1>
                    <p className="text-slate-400">Monitor users, subscriptions, and platform health.</p>
                </div>
                <div className="flex gap-4">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 px-6 py-4 rounded-2xl text-center">
                        <div className="text-2xl font-bold text-indigo-400">1.2k</div>
                        <div className="text-xs text-slate-500 uppercase tracking-tighter">Total Users</div>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 px-6 py-4 rounded-2xl text-center">
                        <div className="text-2xl font-bold text-purple-400">$4.5k</div>
                        <div className="text-xs text-slate-500 uppercase tracking-tighter">Monthly Revenue</div>
                    </div>
                </div>
            </header>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900/50 border-b border-slate-700">
                            <th className="px-6 py-4 text-slate-400 font-semibold text-sm uppercase">User</th>
                            <th className="px-6 py-4 text-slate-400 font-semibold text-sm uppercase">Role</th>
                            <th className="px-6 py-4 text-slate-400 font-semibold text-sm uppercase">Status</th>
                            <th className="px-6 py-4 text-slate-400 font-semibold text-sm uppercase text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-slate-700/30 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-white">{user.name}</div>
                                    <div className="text-sm text-slate-500">{user.email}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.role === 'admin' ? 'bg-indigo-500/20 text-indigo-400' : 'bg-slate-600 text-slate-300'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`flex items-center gap-1.5 text-sm ${user.status === 'Active' ? 'text-green-400' : 'text-red-400'
                                        }`}>
                                        <span className={`w-2 h-2 rounded-full ${user.status === 'Active' ? 'bg-green-400' : 'bg-red-400'}`}></span>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="text-slate-400 hover:text-white transition-colors p-2">
                                        ⚙️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </section>
    );
};

export default Admin;
