import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminRoute from '../../components/AdminRoute';
import ProductService from '../../services/ProductService';
import './AdminProducts.css';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const data = await ProductService.getProducts();
            setProducts(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id, title) => {
        if (!window.confirm(`Сигурни ли сте, че искате да изтриете "${title}"?`)) {
            return;
        }
        try {
            await ProductService.delete(id);
            await loadProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            const errorMessage = error.response?.data?.message 
                || error.response?.data 
                || error.message 
                || 'Грешка при изтриване на продукта';
            alert(`Грешка при изтриване на продукта: ${errorMessage}`);
        }
    };

    const filteredProducts = products.filter(product =>
        product.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <AdminRoute>
            {loading ? (
                <div className="admin-products">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="admin-products">
            <div className="container">
                <div className="admin-header">
                    <div>
                        <Link to="/admin" className="back-link">← Назад към Табло</Link>
                        <h1>Управление на продукти</h1>
                    </div>
                    <Link to="/admin/products/new" className="button-primary">
                        + Добави продукт
                    </Link>
                </div>

                <div className="admin-toolbar">
                    <div className="search-box">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2"/>
                            <line x1="16.5" y1="16.5" x2="22" y2="22" stroke="currentColor" strokeWidth="2"/>
                        </svg>
                        <input
                            type="text"
                            placeholder="Търси продукти..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <p className="products-count">{filteredProducts.length} продукта</p>
                </div>

                {filteredProducts.length === 0 ? (
                    <div className="empty-state">
                        <p>Няма продукти</p>
                        <Link to="/admin/products/new" className="button-primary">
                            Добави първия продукт
                        </Link>
                    </div>
                ) : (
                    <div className="products-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Изображение</th>
                                    <th>Заглавие</th>
                                    <th>Категория</th>
                                    <th>Цена</th>
                                    <th>Наличност</th>
                                    <th>Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredProducts.map((product) => (
                                    <tr key={product.id}>
                                        <td>
                                            {product.mainImageUrl || product.images?.[0]?.url ? (
                                                <img
                                                    src={product.mainImageUrl || product.images[0].url}
                                                    alt={product.title}
                                                    className="product-thumb"
                                                />
                                            ) : (
                                                <div className="product-thumb-placeholder">
                                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                                        <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                    </svg>
                                                </div>
                                            )}
                                        </td>
                                        <td>
                                            <Link to={`/product/${product.id}`} className="product-link">
                                                {product.title}
                                            </Link>
                                        </td>
                                        <td>{product.category?.name || '-'}</td>
                                        <td>{parseFloat(product.price || 0).toFixed(2)} лв.</td>
                                        <td>
                                            <span className={`stock-badge ${(product.stock || 0) > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                <Link
                                                    to={`/admin/products/${product.id}/edit`}
                                                    className="action-button edit"
                                                >
                                                    Редактирай
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(product.id, product.title)}
                                                    className="action-button delete"
                                                >
                                                    Изтрий
                                                </button>
                                            </div>
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
