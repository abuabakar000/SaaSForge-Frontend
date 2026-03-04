import useSubscription from "../hooks/useSubscription";
import { Link } from "react-router-dom";

const FeatureGate = ({ children, fallback }) => {
    const { isPro } = useSubscription();

    if (isPro) return children;

    return fallback || (
        <div className="p-6 bg-slate-800/50 border border-slate-700 rounded-2xl text-center">
            <span className="text-3xl mb-4 block">🔒</span>
            <h4 className="text-lg font-bold text-white mb-2">Pro Feature</h4>
            <p className="text-slate-400 text-sm mb-4">Upgrade to the Pro plan to unlock this advanced capability.</p>
            <Link to="/pricing" className="text-indigo-400 text-sm font-bold hover:underline">
                View Pricing →
            </Link>
        </div>
    );
};

export default FeatureGate;
