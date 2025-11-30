import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminRoute from '../../components/AdminRoute';
import ProductService from '../../services/ProductService';
import { OrderService } from '../../services/OrderService';
import UserService from '../../services/UserService';
import ReviewService from '../../services/ReviewService';
import './AdminDashboard.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        products: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        reviews: 0
    });
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            // Load products
            const products = await ProductService.getProducts();
            
            // Load orders (try to get all, fallback to empty)
            let orders = [];
            try {
                const ordersResponse = await OrderService.getAll();
                orders = Array.isArray(ordersResponse.data) ? ordersResponse.data : [];
            } catch (error) {
                // If getAll doesn't work, try getting by status
                try {
                    const newOrders = await OrderService.getByStatus('NEW');
                    const processingOrders = await OrderService.getByStatus('PROCESSING');
                    orders = [...(Array.isArray(newOrders.data) ? newOrders.data : []), 
                              ...(Array.isArray(processingOrders.data) ? processingOrders.data : [])];
                } catch (e) {
                    console.error('Error loading orders:', e);
                }
            }
            
            // Load users
            const usersResponse = await UserService.getAll();
            const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];

            // Load reviews
            let reviews = [];
            try {
                reviews = await ReviewService.getAllReviews();
            } catch (error) {
                console.error('Error loading reviews:', error);
            }

            // Calculate revenue
            const revenue = orders.reduce((sum, order) => {
                return sum + parseFloat(order.totalAmount || 0);
            }, 0);

            setStats({
                products: products.length,
                orders: orders.length,
                users: users.length,
                revenue: revenue,
                reviews: reviews.length
            });

            // Get recent orders (last 5)
            setRecentOrders(orders.slice(0, 5));
        } catch (error) {
            console.error('Error loading dashboard data:', error);
        } finally {
            setLoading(false);
        }
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

    return (
        <AdminRoute>
            {loading ? (
                <div className="admin-dashboard">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="admin-dashboard">
            <div className="container">
                <div className="admin-header">
                    <h1>Административен панел</h1>
                    <p>Добре дошли в управлението на магазина</p>
                </div>

                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(255, 107, 53, 0.1)', color: '#ff6b35' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Продукти</h3>
                            <p className="stat-value">{stats.products}</p>
                        </div>
                        <Link to="/admin/products" className="stat-link">
                            Управление →
                        </Link>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(77, 171, 247, 0.1)', color: '#4dabf7' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
                                <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Поръчки</h3>
                            <p className="stat-value">{stats.orders}</p>
                        </div>
                        <Link to="/admin/orders" className="stat-link">
                            Управление →
                        </Link>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(81, 207, 102, 0.1)', color: '#51cf66' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Потребители</h3>
                            <p className="stat-value">{stats.users}</p>
                        </div>
                        <Link to="/admin/users" className="stat-link">
                            Управление →
                        </Link>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(255, 170, 77, 0.1)', color: '#ffaa4d' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <line x1="12" y1="1" x2="12" y2="23" stroke="currentColor" strokeWidth="2"/>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" stroke="currentColor" strokeWidth="2"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Приходи</h3>
                            <p className="stat-value">{stats.revenue.toFixed(2)} лв.</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon" style={{ background: 'rgba(139, 92, 246, 0.1)', color: '#8b5cf6' }}>
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <div className="stat-content">
                            <h3>Ревюта</h3>
                            <p className="stat-value">{stats.reviews || 0}</p>
                        </div>
                        <Link to="/admin/reviews" className="stat-link">
                            Управление →
                        </Link>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>Последни поръчки</h2>
                            <Link to="/admin/orders" className="view-all-link">
                                Виж всички →
                            </Link>
                        </div>
                        {recentOrders.length === 0 ? (
                            <div className="empty-state">
                                <p>Няма поръчки</p>
                            </div>
                        ) : (
                            <div className="orders-list">
                                {recentOrders.map((order) => (
                                    <Link
                                        key={order.id}
                                        to={`/orders/${order.id}`}
                                        className="order-item"
                                    >
                                        <div>
                                            <h3>Поръчка #{order.id}</h3>
                                            <p className="order-meta">
                                                {new Date(order.createdAt).toLocaleDateString('bg-BG')} • {parseFloat(order.totalAmount || 0).toFixed(2)} лв.
                                            </p>
                                        </div>
                                        <span
                                            className="order-status"
                                            style={{ color: getStatusColor(order.status) }}
                                        >
                                            {order.status}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="dashboard-section">
                        <div className="section-header">
                            <h2>Бързи действия</h2>
                        </div>
                        <div className="quick-actions">
                            <Link to="/admin/products/new" className="quick-action">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2"/>
                                    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Добави продукт
                            </Link>
                            <Link to="/admin/products" className="quick-action">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Управление на продукти
                            </Link>
                            <Link to="/admin/orders" className="quick-action">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Управление на поръчки
                            </Link>
                            <Link to="/admin/users" className="quick-action">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                                    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                                </svg>
                                Управление на потребители
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
            )}
        </AdminRoute>
    );
}
