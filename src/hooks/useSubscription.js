import useAuth from "./useAuth";

const useSubscription = () => {
    const { auth } = useAuth();

    // In our demo, admins are always Pro. 
    // In a real app, you'd check a specific 'isPro' or 'plan' field from the user object.
    const isPro = auth?.roles?.includes('admin') || auth?.isPro;
    const plan = isPro ? 'Pro' : 'Free';

    return { isPro, plan };
};

export default useSubscription;
