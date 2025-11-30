import { Link } from 'react-router-dom';
import './ReviewCard.css';

/**
 * Review card component that displays a product review with rating, user info, and comment.
 * Shows star rating, user avatar, date, and optional product link.
 * 
 * @param {Object} props - Component props
 * @param {Object} props.review - Review object containing rating, comment, user, product, and createdAt
 */
export default function ReviewCard({ review }) {
    if (!review) return null;

    /**
     * Formats a date string to a localized date format.
     * 
     * @param {string} dateString - ISO date string
     * @returns {string} Formatted date string
     */
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('bg-BG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    /**
     * Renders star rating display.
     * 
     * @param {number} rating - Rating value (1-5)
     * @returns {Array} Array of star elements
     */
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

    return (
        <div className="review-card">
            <div className="review-header">
                <div className="review-user-info">
                    <div className="review-avatar">
                        {review.user?.username?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div className="review-user-details">
                        <h4 className="review-username">
                            {review.user?.username || 'Anonymous user'}
                        </h4>
                        <p className="review-date">
                            {formatDate(review.createdAt)}
                        </p>
                    </div>
                </div>
                <div className="review-rating">
                    {renderStars(review.rating || 0)}
                </div>
            </div>
            
            {review.comment && (
                <p className="review-comment">
                    {review.comment}
                </p>
            )}

            {review.product && (
                <Link 
                    to={`/product/${review.product.id}`}
                    className="review-product-link"
                >
                    <span>For product: </span>
                    <strong>{review.product.title}</strong>
                </Link>
            )}
        </div>
    );
}

