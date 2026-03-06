import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { Check, Zap, CreditCard, Shield, Star, Crown, ArrowRight } from "lucide-react";

const Pricing = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);

    const isPro = auth?.roles?.includes('admin');

    const handleSubscribe = async (action) => {
        setLoading(true);
        try {
            if (action === 'upgrade') {
                const response = await axiosPrivate.post('/stripe/create-checkout-session', {});
                if (response.data?.url) {
                    window.location.href = response.data.url;
                }
            } else if (action === 'manage' || action === 'update_payment') {
                const response = await axiosPrivate.post('/stripe/create-portal-session', {});
                if (response.data?.url) {
                    window.location.href = response.data.url;
                }
            } else if (action === 'cancel') {
                const response = await axiosPrivate.post('/stripe/create-portal-session', {});
                if (response.data?.url) {
                    window.location.href = response.data.url;
                }
            }
        } catch (err) {
            console.error('Subscription error:', err);
            const message = err.response?.data?.message || 'Failed to initiate Stripe session';
            alert(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-12 animate-in fade-in duration-700">
            {/* Header Area */}
            <div className="text-center max-w-3xl mx-auto space-y-4">
                <h1 className="text-4xl font-black text-white tracking-tighter sm:text-6xl">
                    Expand Your <span className="text-indigo-500">Node</span>.
                </h1>
                <p className="text-slate-500 text-lg font-medium">Choose a specialized plan to scale your development capacity and unlock advanced neural features.</p>

                <div className="flex items-center justify-center gap-4 pt-4">
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-2xl text-xs font-bold text-slate-400">
                        <Shield className="w-4 h-4 text-emerald-500" /> Secure Protocol
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-slate-900/50 border border-white/5 rounded-2xl text-xs font-bold text-slate-400">
                        <CreditCard className="w-4 h-4 text-indigo-500" /> Stripe Integrated
                    </div>
                </div>
            </div>

            {/* Current Plan status (Layered Glass Card) */}
            <div className={`p-10 rounded-[2.5rem] border relative overflow-hidden premium-shadow group transition-all duration-700 ${isPro
                ? 'bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border-indigo-500/30'
                : 'bg-slate-900/40 border-white/5 shadow-xl'
                }`}>

                {isPro && (
                    <div className="absolute top-0 right-0 p-10 text-indigo-500/10 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                        <Crown className="w-48 h-48" />
                    </div>
                )}

                <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="flex items-center gap-4 mb-8">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl ${isPro ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>
                                {isPro ? <Zap className="w-8 h-8 fill-current" /> : <Star className="w-8 h-8" />}
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Authenticated Tier</p>
                                <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">{isPro ? 'Pro Member' : 'System Guest'}</h2>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 bg-slate-950/30 p-6 rounded-2xl border border-white/5">
                            <div>
                                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Node Slots</p>
                                <p className="text-lg font-bold text-white tracking-tight">{isPro ? 'Unlimited Access' : '3 Verified'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest mb-1">Plan Status</p>
                                <div className="flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                    <span className="text-lg font-bold text-emerald-500 italic">Active</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4">
                        {isPro ? (
                            <div className="space-y-4">
                                <button
                                    onClick={() => handleSubscribe('manage')}
                                    disabled={loading}
                                    className="w-full px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-xs rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <CreditCard className="w-4 h-4" /> Manage System Billing
                                </button>
                                <button
                                    onClick={() => handleSubscribe('cancel')}
                                    disabled={loading}
                                    className="group w-full px-8 py-4 text-red-500/60 hover:text-red-400 font-black uppercase tracking-widest text-[10px] text-center border border-transparent hover:border-red-500/20 rounded-2xl transition-all"
                                >
                                    Relinquish Pro Status <ArrowRight className="inline w-3 h-3 ml-2 translate-x-0 group-hover:translate-x-2 transition-transform" />
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 text-center lg:text-left">
                                <p className="text-slate-400 font-medium">Unlock higher frequency development and unlimited neural project storage by upgrading to a specialized node.</p>
                                <button
                                    onClick={() => handleSubscribe('upgrade')}
                                    disabled={loading}
                                    className="w-full px-12 py-5 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-[0.2em] text-sm rounded-[1.5rem] shadow-2xl shadow-indigo-600/30 transition-all active:scale-95 hover:-translate-y-1 flex items-center justify-center gap-3"
                                >
                                    <Zap className="w-5 h-5 fill-current" /> Initialize Pro Upgrade
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Plans Grid */}
            <div className="grid md:grid-cols-2 gap-10">
                {/* Basic / Free Tier Card */}
                <div className="bg-slate-900/20 backdrop-blur-sm p-10 rounded-[3rem] border border-white/5 flex flex-col relative group">
                    <div className="mb-10">
                        <h3 className="text-xl font-bold text-white mb-2 italic">Standard Node</h3>
                        <p className="text-slate-500 text-sm font-medium">Foundational tools for new system explorers.</p>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-black text-white italic tracking-tighter">$0</span>
                            <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Forever</span>
                        </div>
                    </div>

                    <ul className="space-y-5 mb-12 flex-1">
                        {[
                            '3 specialized project nodes',
                            'Standard image upload (1/node)',
                            'Global verified dashboard',
                            'Tier 1 community support'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center text-slate-400 text-sm font-semibold opacity-80">
                                <Check className="w-5 h-5 text-emerald-500 mr-4 shrink-0" /> {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        disabled
                        className="w-full py-5 rounded-2xl font-black uppercase tracking-widest text-[10px] bg-slate-950 border border-white/5 text-slate-600 cursor-default"
                    >
                        {!isPro ? 'Identity Verified' : 'Standard Tier'}
                    </button>
                </div>

                {/* Pro Tier Card */}
                <div className="bg-slate-900/40 backdrop-blur-md p-10 rounded-[3rem] border border-indigo-500/50 flex flex-col relative overflow-hidden premium-shadow group scale-105 z-10 shadow-2xl shadow-indigo-500/10">
                    <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-black px-6 py-2 rounded-bl-[1.5rem] tracking-[0.2em] uppercase italic">
                        Elite Plan
                    </div>

                    <div className="mb-10">
                        <h3 className="text-2xl font-black text-indigo-400 mb-2 italic">High Frequency</h3>
                        <p className="text-slate-400 text-sm font-medium">Uncapped potential for heavy development cycles.</p>
                    </div>

                    <div className="mb-10">
                        <div className="flex items-baseline gap-2">
                            <span className="text-6xl font-black text-white italic tracking-tighter">$5</span>
                            <span className="text-slate-500 font-black uppercase tracking-widest text-[10px]">Per month</span>
                        </div>
                        <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-2">Billed per cycle</p>
                    </div>

                    <ul className="space-y-5 mb-12 flex-1">
                        {[
                            'Unlimited specialized nodes',
                            'Neural image clustering (Multi-upload)',
                            'High-frequency verification badges',
                            'Featured gallery placement',
                            'Direct priority transmission'
                        ].map((feature, i) => (
                            <li key={i} className="flex items-center text-white text-sm font-semibold">
                                <Check className="w-5 h-5 text-indigo-500 mr-4 shrink-0" /> {feature}
                            </li>
                        ))}
                    </ul>

                    <button
                        onClick={() => handleSubscribe(isPro ? 'manage' : 'upgrade')}
                        disabled={loading}
                        className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] transition-all flex items-center justify-center gap-3 ${isPro
                            ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/50 cursor-default'
                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xl shadow-indigo-600/20 active:scale-95'
                            }`}
                    >
                        {loading ? 'Initializing...' : (isPro ? 'Member Status Verified' : 'Authorize Expansion')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Pricing;
