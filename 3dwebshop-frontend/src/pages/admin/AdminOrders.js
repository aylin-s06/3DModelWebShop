import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import AdminRoute from '../../components/AdminRoute';
import { OrderService } from '../../services/OrderService';
import './AdminOrders.css';

export default function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('ALL');

    const loadOrders = useCallback(async () => {
        try {
            let ordersData = [];
            
            if (statusFilter === 'ALL') {
                try {
                    const response = await OrderService.getAll();
                    ordersData = Array.isArray(response.data) ? response.data : [];
                } catch (error) {
                    // Try loading by different statuses
                    const statuses = ['NEW', 'PROCESSING', 'SHIPPED', 'COMPLETED'];
                    const allOrders = [];
                    for (const status of statuses) {
                        try {
                            const response = await OrderService.getByStatus(status);
                            if (Array.isArray(response.data)) {
                                allOrders.push(...response.data);
                            }
                        } catch (e) {
                            console.error(`Error loading ${status} orders:`, e);
                        }
                    }
                    ordersData = allOrders;
                }
            } else {
                const response = await OrderService.getByStatus(statusFilter);
                ordersData = Array.isArray(response.data) ? response.data : [];
            }

            setOrders(ordersData);
        } catch (error) {
            console.error('Error loading orders:', error);
        } finally {
            setLoading(false);
        }
    }, [statusFilter]);

    useEffect(() => {
        loadOrders();
    }, [statusFilter, loadOrders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await OrderService.updateStatus(orderId, newStatus);
            await loadOrders();
        } catch (error) {
            console.error('Error updating order status:', error);
            alert('Грешка при актуализиране на статуса');
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
                <div className="admin-orders">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="admin-orders">
            <div className="container">
                <div className="admin-header">
                    <Link to="/admin" className="back-link">← Назад към Табло</Link>
                    <h1>Управление на поръчки</h1>
                </div>

                <div className="admin-toolbar">
                    <div className="filter-group">
                        <label>Филтър по статус:</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="ALL">Всички</option>
                            <option value="NEW">Нови</option>
                            <option value="PROCESSING">Обработва се</option>
                            <option value="SHIPPED">Изпратени</option>
                            <option value="COMPLETED">Завършени</option>
                            <option value="CANCELED">Отменени</option>
                        </select>
                    </div>
                    <p className="orders-count">{orders.length} поръчки</p>
                </div>

                {orders.length === 0 ? (
                    <div className="empty-state">
                        <p>Няма поръчки</p>
                    </div>
                ) : (
                    <div className="orders-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Потребител</th>
                                    <th>Дата</th>
                                    <th>Сума</th>
                                    <th>Статус</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order.id}>
                                        <td>
                                            <Link to={`/orders/${order.id}`} className="order-link">
                                                #{order.id}
                                            </Link>
                                        </td>
                                        <td>{order.user?.username || order.user?.name || '-'}</td>
                                        <td>
                                            {new Date(order.createdAt).toLocaleDateString('bg-BG')}
                                        </td>
                                        <td>{parseFloat(order.totalAmount || 0).toFixed(2)} лв.</td>
                                        <td>
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className="status-select"
                                                style={{ color: getStatusColor(order.status) }}
                                            >
                                                <option value="NEW">Нова</option>
                                                <option value="PROCESSING">Обработва се</option>
                                                <option value="SHIPPED">Изпратена</option>
                                                <option value="COMPLETED">Завършена</option>
                                                <option value="CANCELED">Отменена</option>
                                            </select>
                                        </td>
                                        <td>
                                            <Link
                                                to={`/orders/${order.id}`}
                                                className="action-button view"
                                            >
                                                Виж детайли
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
            )}
        </AdminRoute>
    );
}
