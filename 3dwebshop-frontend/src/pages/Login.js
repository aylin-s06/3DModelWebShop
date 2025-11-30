import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

/**
 * Login page component for user authentication.
 * Handles user login form submission and redirects authenticated users.
 */
export default function Login() {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    /**
     * Handles form submission for user login.
     * 
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const result = await login(formData.username, formData.password);
        
        if (result.success) {
            navigate('/');
        } else {
            // Ensure error is a string
            const errorMsg = typeof result.error === 'string' 
                ? result.error 
                : (result.error?.message || result.error?.error || 'Login error');
            setError(errorMsg);
        }
        
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Вход</h1>
                        <p className="auth-subtitle">Влезте в своя профил</p>
                    </div>

                    {error && (
                        <div className="auth-error">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
                                <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="username">Потребителско име</label>
                            <input
                                type="text"
                                id="username"
                                value={formData.username}
                                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                required
                                placeholder="Въведете потребителско име"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Парола</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Въведете парола"
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Влизане...
                                </>
                            ) : (
                                'Влез'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Нямате профил?{' '}
                            <Link to="/register" className="auth-link">
                                Регистрирайте се
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
