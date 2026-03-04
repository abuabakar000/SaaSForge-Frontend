import { useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import useAuth from "../hooks/useAuth";
import { Check, Zap, CreditCard, Shield, Star } from "lucide-react";

const Pricing = () => {
    const { auth } = useAuth();
    const axiosPrivate = useAxiosPrivate();
    const [loading, setLoading] = useState(false);

    const isPro = auth?.roles?.includes('admin');

    const handleSubscribe = async (action) => {
        setLoading(true);
        try {
            if (action === 'upgrade') {
                // Placeholder for Stripe upgrade flow
                alert('Stripe Upgrade Flow - Coming Soon!\nWill call /stripe/create-checkout-session');
            } else if (action === 'manage') {
                // Placeholder for Stripe Customer Portal
                alert('Stripe Manage Billing Flow - Coming Soon!\nWill call /stripe/customer-portal');
            } else if (action === 'update_payment') {
                alert('Update Payment Method - Coming Soon!\nWill open Stripe Customer Portal');
            } else if (action === 'cancel') {
                if (window.confirm("Are you sure you want to cancel your Pro subscription?")) {
                    alert('Subscription Cancelation - Coming Soon!\nWill call /stripe/cancel-subscription');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Failed to initiate action');
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="p-8 max-w-5xl mx-auto space-y-12">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                    Billing & Plans
                </h1>
                <p className="text-slate-400">Manage your subscription and billing details.</p>
            </header>

            {/* 1. Current Plan Section */}
            <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-indigo-400" />
                    Current Plan Overview
                </h2>

                <div className={`p-8 rounded-2xl border relative overflow-hidden shadow-xl ${isPro
                    ? 'bg-gradient-to-br from-indigo-900/30 to-purple-900/30 border-indigo-500/50 shadow-indigo-500/10'
                    : 'bg-slate-800/80 border-slate-700/50'
                    }`}>

                    {isPro && (
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Star className="w-32 h-32 text-indigo-400" />
                        </div>
                    )}

                    <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <div className="flex items-center gap-3 mb-2">
                                <span className={`text-sm font-black tracking-widest uppercase px-3 py-1 rounded bg-slate-900 border ${isPro ? 'text-indigo-400 border-indigo-500/30' : 'text-slate-400 border-slate-700'}`}>
                                    {isPro ? 'PRO PLAN' : 'FREE PLAN'}
                                </span>
                                {isPro && (
                                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                                        Active
                                    </span>
                                )}
                            </div>

                            <div className="mt-6">
                                <div className="space-y-2 pb-4">
                                    <p className="text-slate-300"><span className="text-slate-500 w-24 inline-block">Plan:</span> {isPro ? 'Pro' : 'Free'}</p>
                                    <p className="text-slate-300"><span className="text-slate-500 w-24 inline-block">Status:</span> <span className="text-emerald-400 font-medium">Active</span></p>
                                    <p className="text-slate-300"><span className="text-slate-500 w-24 inline-block">Next Billing:</span> {isPro ? 'April 12, 2026' : 'N/A'}</p>
                                </div>
                                <div className="space-y-2 py-4 border-t border-slate-700/50">
                                    <p className="text-sm font-bold text-slate-400 mb-1">Usage</p>
                                    <p className="text-slate-300"><span className="text-slate-500 w-32 inline-block">Projects allowed:</span> {isPro ? 'Unlimited' : '3 Max'}</p>
                                </div>
                                <div className="space-y-2 pt-4 border-t border-slate-700/50">
                                    <p className="text-sm font-bold text-slate-400 mb-1">Billing</p>
                                    <p className="text-slate-300"><span className="text-slate-500 w-24 inline-block">Price:</span> {isPro ? '$10 / month' : '$0 / month'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 justify-center md:items-end">
                            {isPro ? (
                                <>
                                    <button
                                        onClick={() => handleSubscribe('manage')}
                                        disabled={loading}
                                        className="w-full md:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl transition-colors shadow-lg"
                                    >
                                        Manage Billing
                                    </button>
                                    <button
                                        onClick={() => handleSubscribe('update_payment')}
                                        disabled={loading}
                                        className="w-full md:w-auto px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl transition-colors border border-slate-600"
                                    >
                                        Update Payment Method
                                    </button>
                                    <button
                                        onClick={() => handleSubscribe('cancel')}
                                        disabled={loading}
                                        className="w-full md:w-auto px-6 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-xl transition-colors border border-red-500/20"
                                    >
                                        Cancel Subscription
                                    </button>
                                </>
                            ) : (
                                <button
                                    onClick={() => handleSubscribe('upgrade')}
                                    disabled={loading}
                                    className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5"
                                >
                                    <Zap className="w-5 h-5 fill-current" /> Upgrade to Pro
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Available Plans */}
            <div>
                <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-indigo-400" />
                    Available Plans
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                    {/* Free Tier */}
                    <div className="p-8 rounded-2xl border border-slate-700 bg-slate-800/50 flex flex-col">
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-white mb-1">FREE</h3>
                                <p className="text-slate-400 text-sm">Perfect for individuals just starting out.</p>
                            </div>
                            {!isPro && <span className="text-xs font-bold px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 whitespace-nowrap">✓ Current Plan</span>}
                        </div>
                        <div className="text-4xl font-black text-white mb-8">
                            $0
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center text-slate-300 font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> 3 projects limit
                            </li>
                            <li className="flex items-center text-slate-300 font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> 1 image per project
                            </li>
                            <li className="flex items-center text-slate-300 font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> Basic dashboard access
                            </li>
                            <li className="flex items-center text-slate-300 font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> Community support
                            </li>
                        </ul>
                        <button
                            disabled
                            className="w-full py-3 rounded-xl font-bold bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600"
                        >
                            {!isPro ? 'Current Plan' : 'Free Tier'}
                        </button>
                    </div>

                    {/* Pro Tier */}
                    <div className="p-8 rounded-2xl border border-indigo-500 bg-indigo-900/10 flex flex-col relative overflow-hidden shadow-2xl shadow-indigo-500/10">
                        <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-black px-3 py-1 rounded-bl-lg tracking-wider uppercase">
                            Most Popular
                        </div>
                        <div className="mb-4 flex items-start justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-indigo-400 mb-1">PRO</h3>
                                <p className="text-slate-400 text-sm">For serious creators who need no limits.</p>
                            </div>
                            {isPro && <span className="text-xs font-bold px-3 py-1 flex-shrink-0 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20 whitespace-nowrap z-10">✓ Current Plan</span>}
                        </div>
                        <div className="mb-8">
                            <div className="text-4xl font-black text-white flex items-end">
                                $10<span className="text-lg font-bold text-slate-400 mb-1 ml-1">/month</span>
                            </div>
                            <div className="text-sm text-slate-500 font-medium mt-1">billed monthly</div>
                        </div>
                        <ul className="space-y-4 mb-8 flex-1">
                            <li className="flex items-center text-white font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> Unlimited projects
                            </li>
                            <li className="flex items-center text-white font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> Multiple images per project
                            </li>
                            <li className="flex items-center text-white font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> Advanced analytics
                            </li>
                            <li className="flex items-center text-white font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> Priority 24/7 support
                            </li>
                            <li className="flex items-center text-white font-medium">
                                <Check className="w-5 h-5 text-indigo-400 mr-3 shrink-0" /> Feature your best work
                            </li>
                        </ul>
                        <button
                            onClick={() => handleSubscribe(isPro ? 'manage' : 'upgrade')}
                            disabled={loading}
                            className={`w-full py-3 rounded-xl font-bold transition-all ${isPro
                                ? 'bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 border border-indigo-500/50'
                                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/25 active:scale-95'
                                }`}
                        >
                            {loading ? 'Processing...' : (isPro ? 'Manage Billing' : 'Upgrade to Pro')}
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Pricing;
