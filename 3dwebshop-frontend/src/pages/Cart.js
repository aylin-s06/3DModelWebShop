import { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CartService from '../services/CartService';
import './Cart.css';

/**
 * Shopping cart page component.
 * Displays cart items, allows quantity updates, item removal, and cart clearing.
 * Requires user authentication.
 */
export default function Cart() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState({});

    /**
     * Loads cart items for the current user.
     */
    const loadCart = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await CartService.getCart(user.id);
            setCartItems(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Redirect to login if not authenticated, otherwise load cart
    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [isAuthenticated, user, navigate, loadCart]);

    /**
     * Updates the quantity of a cart item.
     * 
     * @param {number|string} itemId - Cart item ID
     * @param {number} newQuantity - New quantity value
     */
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) {
            removeItem(itemId);
            return;
        }

        setUpdating({ ...updating, [itemId]: true });
        try {
            await CartService.updateQuantity(user.id, itemId, newQuantity);
            await loadCart();
        } catch (error) {
            console.error('Error updating quantity:', error);
            alert('Error updating quantity');
        } finally {
            setUpdating({ ...updating, [itemId]: false });
        }
    };

    /**
     * Removes an item from the cart.
     * 
     * @param {number|string} itemId - Cart item ID to remove
     */
    const removeItem = async (itemId) => {
        setUpdating({ ...updating, [itemId]: true });
        try {
            await CartService.removeFromCart(user.id, itemId);
            await loadCart();
        } catch (error) {
            console.error('Error removing item:', error);
            alert('Error removing product');
        } finally {
            setUpdating({ ...updating, [itemId]: false });
        }
    };

    /**
     * Clears all items from the cart after user confirmation.
     */
    const clearCart = async () => {
        if (!window.confirm('Are you sure you want to clear the cart?')) {
            return;
        }
        try {
            await CartService.clearCart(user.id);
            await loadCart();
        } catch (error) {
            console.error('Error clearing cart:', error);
            alert('Error clearing cart');
        }
    };

    /**
     * Calculates the total price of all items in the cart.
     * 
     * @returns {number} Total cart value
     */
    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = parseFloat(item.priceAtAdd || item.product?.price || 0);
            const qty = item.qty || 1;
            return sum + (price * qty);
        }, 0);
    };

    if (loading) {
        return (
            <div className="cart-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                <div className="cart-header">
                    <h1>Количка</h1>
                    {cartItems.length > 0 && (
                        <button className="clear-cart-button" onClick={clearCart}>
                            Изчисти количката
                        </button>
                    )}
                </div>

                {cartItems.length === 0 ? (
                    <div className="cart-empty">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
                            <path d="M3 5h2l2 11h10l2-8H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <circle cx="9" cy="20" r="1" fill="currentColor"/>
                            <circle cx="18" cy="20" r="1" fill="currentColor"/>
                        </svg>
                        <h2>Количката ви е празна</h2>
                        <p>Добавете продукти от каталога</p>
                        <Link to="/catalog" className="button-primary">
                            Разгледайте каталога
                        </Link>
                    </div>
                ) : (
                    <div className="cart-content">
                        <div className="cart-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <Link
                                        to={`/product/${item.product?.id || item.productId}`}
                                        className="cart-item-image"
                                    >
                                        {item.product?.mainImageUrl || (item.product?.images && item.product.images.length > 0 && item.product.images[0]?.imageUrl) ? (
                                            <img
                                                src={item.product.mainImageUrl || item.product.images[0]?.imageUrl}
                                                alt={item.product.title}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextElementSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="cart-item-placeholder" style={{ display: item.product?.mainImageUrl || (item.product?.images && item.product.images.length > 0) ? 'none' : 'flex' }}>
                                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
                                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
                                                <path d="M9 9h6v6H9z" stroke="currentColor" strokeWidth="2"/>
                                            </svg>
                                        </div>
                                    </Link>

                                    <div className="cart-item-info">
                                        <Link to={`/product/${item.product?.id || item.productId}`}>
                                            <h3>{item.product?.title || 'Продукт'}</h3>
                                        </Link>
                                        <p className="cart-item-price">
                                            {parseFloat(item.priceAtAdd || item.product?.price || 0).toFixed(2)} лв.
                                        </p>
                                    </div>

                                    <div className="cart-item-quantity">
                                        <button
                                            onClick={() => updateQuantity(item.id, (item.qty || 1) - 1)}
                                            disabled={updating[item.id]}
                                            className="quantity-button"
                                        >
                                            −
                                        </button>
                                        <span className="quantity-value">{item.qty || 1}</span>
                                        <button
                                            onClick={() => updateQuantity(item.id, (item.qty || 1) + 1)}
                                            disabled={updating[item.id]}
                                            className="quantity-button"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="cart-item-total">
                                        <p>
                                            {(parseFloat(item.priceAtAdd || item.product?.price || 0) * (item.qty || 1)).toFixed(2)} лв.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        disabled={updating[item.id]}
                                        className="cart-item-remove"
                                        aria-label="Премахни"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
                                            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h2>Резюме</h2>
                            <div className="summary-row">
                                <span>Междинна сума</span>
                                <span>{calculateTotal().toFixed(2)} лв.</span>
                            </div>
                            <div className="summary-row">
                                <span>Доставка</span>
                                <span>Безплатна</span>
                            </div>
                            <div className="summary-divider"></div>
                            <div className="summary-row total">
                                <span>Общо</span>
                                <span>{calculateTotal().toFixed(2)} лв.</span>
                            </div>
                            <Link to="/checkout" className="checkout-button">
                                Продължи към плащане
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
