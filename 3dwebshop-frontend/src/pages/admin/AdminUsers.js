import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminRoute from '../../components/AdminRoute';
import UserService from '../../services/UserService';
import './AdminUsers.css';

export default function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await UserService.getAll();
            setUsers(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading users:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, username) => {
        if (!window.confirm(`Сигурни ли сте, че искате да изтриете потребителя "${username}"?`)) {
            return;
        }
        try {
            await UserService.delete(id);
            await loadUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Грешка при изтриване на потребителя');
        }
    };

    const handleRoleChange = async (id, newRole) => {
        try {
            const user = users.find(u => u.id === id);
            if (!user) return;
            
            // Проверка за ограничаване на администратори
            if ((newRole === 'ADMIN' || newRole === 'admin') && 
                user.role !== 'ADMIN' && user.role !== 'admin') {
                const adminCount = users.filter(u => 
                    (u.role === 'ADMIN' || u.role === 'admin') && u.id !== id
                ).length;
                
                if (adminCount >= 1) {
                    alert('Вече има администратор. Може да има само един администратор.');
                    return;
                }
            }
            
            await UserService.update(id, { ...user, role: newRole });
            await loadUsers();
        } catch (error) {
            console.error('Error updating user role:', error);
            const errorMsg = error.response?.data || error.message || 'Грешка при актуализиране на ролята';
            alert(typeof errorMsg === 'string' ? errorMsg : 'Грешка при актуализиране на ролята');
        }
    };

    const filteredUsers = users.filter(user =>
        user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminRoute>
            {loading ? (
                <div className="admin-users">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="admin-users">
            <div className="container">
                <div className="admin-header">
                    <Link to="/admin" className="back-link">← Назад към Табло</Link>
                    <h1>Управление на потребители</h1>
                </div>

                <div className="admin-toolbar">
                    <div className="search-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Търси потребители..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <p className="users-count">{filteredUsers.length} потребители</p>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="empty-state">
                        <p>Няма потребители</p>
                    </div>
                ) : (
                    <div className="users-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Потребителско име</th>
                                    <th>Имейл</th>
                                    <th>Име</th>
                                    <th>Роля</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user) => (
                                    <tr key={user.id}>
                                        <td>#{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.name || '-'}</td>
                                        <td>
                                            <select
                                                value={user.role || 'USER'}
                                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                className="role-select"
                                            >
                                                <option value="USER">Потребител</option>
                                                <option value="ADMIN">Администратор</option>
                                            </select>
                                        </td>
                                        <td>
                                            <button
                                                onClick={() => handleDelete(user.id, user.username)}
                                                className="action-button delete"
                                            >
                                                Изтрий
                                            </button>
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
