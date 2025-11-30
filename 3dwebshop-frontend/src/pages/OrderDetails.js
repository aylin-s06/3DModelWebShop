import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { OrderService } from '../services/OrderService';
import './OrderDetails.css';

export default function OrderDetails() {
    const { orderId } = useParams();
    const { user, isAuthenticated, isAdmin } = useAuth();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadOrder = useCallback(async () => {
        try {
            const response = await OrderService.getById(orderId);
            const orderData = response.data;
            
            // Check if user has access to this order
            if (!isAdmin() && orderData.user?.id !== user?.id && orderData.userId !== user?.id) {
                navigate('/profile');
                return;
            }
            
            setOrder(orderData);
        } catch (error) {
            console.error('Error loading order:', error);
            navigate('/profile');
        } finally {
            setLoading(false);
        }
    }, [orderId, isAdmin, user, navigate]);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadOrder();
    }, [orderId, isAuthenticated, navigate, loadOrder]);

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

    const getPaymentMethodText = (method) => {
        const methodMap = {
            'card': 'Кредитна/Дебитна карта',
            'cash': 'Наложен платеж',
            'bank': 'Банков превод'
        };
        return methodMap[method] || method;
    };

    if (loading) {
        return (
            <div className="order-details-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="order-details-page">
                <div className="container">
                    <div className="error-state">
                        <h2>Поръчката не е намерена</h2>
                        <Link to="/profile" className="button-primary">
                            Към профила
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="order-details-page">
            <div className="container">
                <div className="order-header-section">
                    <div>
                        <Link to="/profile" className="back-link">
                            ← Назад към поръчките
                        </Link>
                        <h1>Поръчка #{order.id}</h1>
                        <p className="order-date">
                            Създадена на {new Date(order.createdAt).toLocaleDateString('bg-BG', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <span
                        className="order-status-badge"
                        style={{ 
                            color: getStatusColor(order.status),
                            borderColor: getStatusColor(order.status)
                        }}
                    >
                        {getStatusText(order.status)}
                    </span>
                </div>

                <div className="order-content">
                    <div className="order-main">
                        <div className="order-section">
                            <h2>Продукти</h2>
                            <div className="order-items">
                                {order.items && order.items.length > 0 ? (
                                    order.items.map((item, index) => (
                                        <div key={item.id || index} className="order-item">
                                            <div className="order-item-info">
                                                <h3>{item.product?.title || 'Продукт'}</h3>
                                                <p>Количество: {item.quantity || 1}</p>
                                            </div>
                                            <p className="order-item-price">
                                                {parseFloat(item.price || 0).toFixed(2)} лв.
                                            </p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="no-items">Няма продукти в поръчката</p>
                                )}
                            </div>
                        </div>

                        <div className="order-section">
                            <h2>Адрес за доставка</h2>
                            <p className="order-address">{order.address || 'Не е посочен адрес'}</p>
                        </div>

                        <div className="order-section">
                            <h2>Метод на плащане</h2>
                            <p className="order-payment">{getPaymentMethodText(order.paymentMethod)}</p>
                        </div>
                    </div>

                    <div className="order-summary">
                        <h2>Резюме</h2>
                        <div className="summary-row">
                            <span>Междинна сума</span>
                            <span>{parseFloat(order.totalAmount || 0).toFixed(2)} лв.</span>
                        </div>
                        <div className="summary-row">
                            <span>Доставка</span>
                            <span>Безплатна</span>
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-row total">
                            <span>Общо</span>
                            <span>{parseFloat(order.totalAmount || 0).toFixed(2)} лв.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
