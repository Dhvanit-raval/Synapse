import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { navigateTo } from '../../utils/navigation.js';

export default function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigateTo('/login', { replace: true });
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return null;
    }

    return children;
}
