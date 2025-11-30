import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * AdminRoute component that protects admin routes.
 * Only allows access to authenticated users with admin role.
 * Redirects non-admin users to home page.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components to render if user is admin
 */
export default function AdminRoute({ children }) {
    const { isAuthenticated, isAdmin, loading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Wait for auth to load
        if (loading) return;

        // Check if user is authenticated and is admin
        if (!isAuthenticated || !isAdmin()) {
            console.warn('⚠️ Unauthorized access to admin page. Redirecting...', {
                isAuthenticated,
                isAdmin: isAdmin(),
                userRole: user?.role,
                user
            });
            navigate('/');
            return;
        }

        console.log('✅ Admin access granted:', {
            user: user?.username,
            role: user?.role
        });
    }, [isAuthenticated, isAdmin, loading, user, navigate]);

    // Show loading while checking auth
    if (loading) {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '50vh' 
            }}>
                <div className="loader"></div>
            </div>
        );
    }

    // If not authenticated or not admin, don't render children
    if (!isAuthenticated || !isAdmin()) {
        return null;
    }

    // Render children if user is admin
    return children;
}

