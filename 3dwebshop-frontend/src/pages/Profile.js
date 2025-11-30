import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OrderService } from '../services/OrderService';
import './Profile.css';

export default function Profile() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('orders');

    const loadOrders = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await OrderService.getAll();
            // Filter orders by user if needed
            const userOrders = Array.isArray(response.data) 
                ? response.data.filter(o => o.user?.id === user.id || o.userId === user.id)
                : [];
            setOrders(userOrders);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadOrders();
    }, [isAuthenticated, navigate, loadOrders]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const getStatusColor = (status) => {
        const statusMap = {
            'NEW': '#ff6b35',
            'PROCESSING': '#ffaa4d',
            'SHIPPED': '#4dabf7',
            'COMPLETED': '#51cf66',
            'CANCELED': '#ff6b6b'
        };
        return statusMap[status] || '#c7c7c7';
    };

    const getStatusText = (status) => {
        const statusMap = {
            'NEW': 'Нова',
            'PROCESSING': 'Обработва се',
            'SHIPPED': 'Изпратена',
            'COMPLETED': 'Завършена',
            'CANCELED': 'Отменена'
        };
        return statusMap[status] || status;
    };

    if (!isAuthenticated || !user) {
        return null;
    }

    return (
        <div className="profile-page">
            <div className="container">
                <div className="profile-header">
                    <h1>Моят Профил</h1>
                    <p>Управление на профила и поръчките</p>
                </div>

                <div className="profile-content">
                    <div className="profile-sidebar">
                        <div className="profile-card">
                            <div className="profile-avatar">
                                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2"/>
                                    <path d="M4 20c1.5-3 4.5-5 8-5s6.5 2 8 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                </svg>
                            </div>
                            <h3>{user.name || user.username}</h3>
                            <p className="profile-email">{user.email}</p>
                            {user.role === 'ADMIN' && (
                                <Link to="/admin" className="admin-link">
                                    Административен панел
                                </Link>
                            )}
                        </div>

                        <div className="profile-menu">
                            <button
                                className={activeTab === 'orders' ? 'active' : ''}
                                onClick={() => setActiveTab('orders')}
                            >
                                Поръчки
                            </button>
                            <button
                                className={activeTab === 'settings' ? 'active' : ''}
                                onClick={() => setActiveTab('settings')}
                            >
                                Настройки
                            </button>
                            <button
                                className={activeTab === 'addresses' ? 'active' : ''}
                                onClick={() => setActiveTab('addresses')}
                            >
                                Адреси
                            </button>
                        </div>

                        <button className="logout-button" onClick={handleLogout}>
                            Изход
                        </button>
                    </div>

                    <div className="profile-main">
                        {activeTab === 'orders' && (
                            <div className="profile-section">
                                <h2>Моите Поръчки</h2>
                                {loading ? (
                                    <div className="loading-container">
                                        <div className="loader"></div>
                                    </div>
                                ) : orders.length === 0 ? (
                                    <div className="empty-state">
                                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none">
                                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                            <path d="M21 12c-1 0-3-1-3-3s2-3 3-3 3 1 3 3-2 3-3 3z" stroke="currentColor" strokeWidth="2"/>
                                            <path d="M3 12c1 0 3-1 3-3s-2-3-3-3-3 1-3 3 2 3 3 3z" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                        <p>Нямате поръчки</p>
                                        <Link to="/catalog" className="button-primary">
                                            Разгледайте каталога
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="orders-list">
                                        {orders.map((order) => (
                                            <Link
                                                key={order.id}
                                                to={`/orders/${order.id}`}
                                                className="order-card"
                                            >
                                                <div className="order-header">
                                                    <div>
                                                        <h3>Поръчка #{order.id}</h3>
                                                        <p className="order-date">
                                                            {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                                                        </p>
                                                    </div>
                                                    <span
                                                        className="order-status"
                                                        style={{ color: getStatusColor(order.status) }}
                                                    >
                                                        {getStatusText(order.status)}
                                                    </span>
                                                </div>
                                                <div className="order-footer">
                                                    <p className="order-amount">
                                                        {order.totalAmount?.toFixed(2) || '0.00'} лв.
                                                    </p>
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                                        <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                                                    </svg>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === 'settings' && (
                            <div className="profile-section">
                                <h2>Настройки</h2>
                                <div className="settings-form">
                                    <div className="form-group">
                                        <label>Потребителско име</label>
                                        <input type="text" value={user.username} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label>Имейл</label>
                                        <input type="email" value={user.email} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label>Име</label>
                                        <input type="text" value={user.name || ''} disabled />
                                    </div>
                                    <div className="form-group">
                                        <label>Телефон</label>
                                        <input type="tel" value={user.phone || ''} disabled />
                                    </div>
                                    <p className="settings-note">
                                        За промяна на настройките, моля свържете се с администратора.
                                    </p>
                                </div>
                            </div>
                        )}

                        {activeTab === 'addresses' && (
                            <div className="profile-section">
                                <h2>Адреси</h2>
                                <div className="addresses-list">
                                    {orders.length > 0 && orders[0].address ? (
                                        <div className="address-card">
                                            <h3>Адрес за доставка</h3>
                                            <p>{orders[0].address}</p>
                                        </div>
                                    ) : (
                                        <div className="empty-state">
                                            <p>Нямате запазени адреси</p>
                                            <p className="empty-note">
                                                Адресите ще бъдат запазени след първата поръчка.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
