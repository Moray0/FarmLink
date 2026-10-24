
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { ROLE_HOME } from '../auth/roles';

export default function ProtectedRoute({
    children,
    loginPath = '/login',
    allowedRole,
}) {
    const { user, role, loading } = useAuth();

    if (loading) {
        return <p>Checking login...</p>;
    }

    if (!user) {
        return <Navigate to={loginPath} replace />;
    }

    if (role !== allowedRole) {
        return <Navigate to={ROLE_HOME[role] || '/'} replace />;
    }

    return children;
}
