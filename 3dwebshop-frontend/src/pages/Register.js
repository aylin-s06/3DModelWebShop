import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

/**
 * Registration page component for new user signup.
 * Handles user registration form with validation and error handling.
 */
export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        name: '',
        phone: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { register, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);

    /**
     * Handles form submission for user registration.
     * Validates password match and length before submitting.
     * 
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Validate password match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        // Validate password length
        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setLoading(true);

        const userData = {
            username: formData.username,
            email: formData.email,
            passwordHash: formData.password,
            name: formData.name,
            phone: formData.phone,
            role: 'USER'
        };

        const result = await register(userData);
        
        if (result.success) {
            navigate('/');
        } else {
            // Ensure error is a string
            let errorMsg = typeof result.error === 'string' 
                ? result.error 
                : (result.error?.message || result.error?.error || 'Registration error');
            
            // Translate common errors
            if (errorMsg.includes('Потребителското име вече е заето') || 
                errorMsg.includes('username') || 
                errorMsg.includes('unique_username')) {
                errorMsg = 'Username already taken. Please choose another.';
            } else if (errorMsg.includes('Имейлът вече е регистриран') || 
                       errorMsg.includes('email') || 
                       errorMsg.includes('unique_email')) {
                errorMsg = 'Email already registered. Please use another email.';
            } else if (errorMsg.includes('администратор')) {
                errorMsg = 'Admin user already exists. Only one admin is allowed.';
            }
            
            setError(errorMsg);
        }
        
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1 className="auth-title">Регистрация</h1>
                        <p className="auth-subtitle">Създайте нов профил</p>
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
                            <label htmlFor="username">Потребителско име *</label>
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
                            <label htmlFor="email">Имейл *</label>
                            <input
                                type="email"
                                id="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                                placeholder="Въведете имейл"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="name">Име</label>
                            <input
                                type="text"
                                id="name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Въведете име"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Телефон</label>
                            <input
                                type="tel"
                                id="phone"
                                value={formData.phone}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                placeholder="Въведете телефон"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="password">Парола *</label>
                            <input
                                type="password"
                                id="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                placeholder="Въведете парола (мин. 6 символа)"
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword">Потвърди парола *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                required
                                placeholder="Потвърдете паролата"
                                disabled={loading}
                            />
                        </div>

                        <button type="submit" className="auth-button" disabled={loading}>
                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Регистриране...
                                </>
                            ) : (
                                'Регистрирай се'
                            )}
                        </button>
                    </form>

                    <div className="auth-footer">
                        <p>
                            Вече имате профил?{' '}
                            <Link to="/login" className="auth-link">
                                Влезте тук
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
