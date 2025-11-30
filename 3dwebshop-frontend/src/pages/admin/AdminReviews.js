import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminRoute from '../../components/AdminRoute';
import ReviewService from '../../services/ReviewService';
import './AdminReviews.css';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState({});

    useEffect(() => {
        loadReviews();
    }, []);

    const loadReviews = async () => {
        try {
            setLoading(true);
            const reviewsData = await ReviewService.getAllReviews();
            // Sort by date (newest first)
            const sorted = (reviewsData || []).sort((a, b) => 
                new Date(b.createdAt) - new Date(a.createdAt)
            );
            setReviews(sorted);
        } catch (error) {
            console.error('Error loading reviews:', error);
            setReviews([]);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (reviewId) => {
        if (!window.confirm('Сигурни ли сте, че искате да изтриете това ревю?')) {
            return;
        }

        setDeleting({ ...deleting, [reviewId]: true });
        try {
            await ReviewService.deleteReview(reviewId);
            await loadReviews();
        } catch (error) {
            console.error('Error deleting review:', error);
            alert('Грешка при изтриване на ревюто');
        } finally {
            setDeleting({ ...deleting, [reviewId]: false });
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('bg-BG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= rating ? 'filled' : 'empty'}`}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    if (loading) {
        return (
            <AdminRoute>
                <div className="admin-reviews">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            </AdminRoute>
        );
    }

    return (
        <AdminRoute>
            <div className="admin-reviews">
                <div className="container">
                    <div className="page-header">
                        <Link to="/admin" className="back-link">← Назад към Табло</Link>
                        <h1>Управление на ревюта</h1>
                        <p className="page-subtitle">Общо ревюта: {reviews.length}</p>
                    </div>

                    {reviews.length === 0 ? (
                        <div className="empty-reviews">
                            <p>Няма ревюта в системата.</p>
                        </div>
                    ) : (
                        <div className="reviews-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Потребител</th>
                                        <th>Продукт</th>
                                        <th>Рейтинг</th>
                                        <th>Коментар</th>
                                        <th>Дата</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reviews.map((review) => (
                                        <tr key={review.id}>
                                            <td>
                                                <div className="user-cell">
                                                    <div className="user-avatar">
                                                        {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                                                    </div>
                                                    <span>{review.user?.username || 'Анонимен'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {review.product ? (
                                                    <Link 
                                                        to={`/product/${review.product.id}`}
                                                        className="product-link"
                                                    >
                                                        {review.product.title}
                                                    </Link>
                                                ) : (
                                                    <span className="no-product">Изтрит продукт</span>
                                                )}
                                            </td>
                                            <td>
                                                <div className="rating-cell">
                                                    {renderStars(review.rating || 0)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="comment-cell">
                                                    {review.comment || <em>Няма коментар</em>}
                                                </div>
                                            </td>
                                            <td>{formatDate(review.createdAt)}</td>
                                            <td>
                                                <button
                                                    onClick={() => handleDelete(review.id)}
                                                    disabled={deleting[review.id]}
                                                    className="delete-btn"
                                                >
                                                    {deleting[review.id] ? 'Изтриване...' : 'Изтрий'}
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
        </AdminRoute>
    );
}

