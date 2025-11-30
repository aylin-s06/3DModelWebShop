import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CartService from '../services/CartService';
import { OrderService } from '../services/OrderService';
import './Checkout.css';

export default function Checkout() {
    const { user, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        address: '',
        paymentMethod: 'card',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCVC: ''
    });

    const loadCart = useCallback(async () => {
        if (!user?.id) return;
        try {
            const response = await CartService.getCart(user.id);
            const items = Array.isArray(response.data) ? response.data : [];
            if (items.length === 0) {
                navigate('/cart');
                return;
            }
            setCartItems(items);
        } catch (error) {
            console.error('Error loading cart:', error);
        } finally {
            setLoading(false);
        }
    }, [user, navigate]);

    useEffect(() => {
        if (!isAuthenticated || !user) {
            navigate('/login');
            return;
        }
        loadCart();
    }, [isAuthenticated, user, navigate, loadCart]);

    const calculateTotal = () => {
        return cartItems.reduce((sum, item) => {
            const price = parseFloat(item.priceAtAdd || item.product?.price || 0);
            const qty = item.qty || 1;
            return sum + (price * qty);
        }, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.address.trim()) {
            alert('Моля, въведете адрес за доставка');
            return;
        }

        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCVC) {
                alert('Моля, попълнете всички данни за картата');
                return;
            }
        }

        setSubmitting(true);
        try {
            const orderData = {
                status: 'NEW',
                totalAmount: calculateTotal(),
                address: formData.address,
                paymentMethod: formData.paymentMethod,
                user: { id: user.id },
                items: cartItems.map(item => ({
                    product: { id: item.product?.id || item.productId },
                    quantity: item.qty || 1,
                    price: parseFloat(item.priceAtAdd || item.product?.price || 0)
                }))
            };

            // Create order
            const orderResponse = await OrderService.create(orderData);
            
            // Clear cart
            await CartService.clearCart(user.id);
            
            // Redirect to order details
            navigate(`/orders/${orderResponse.data.id}`);
        } catch (error) {
            console.error('Error creating order:', error);
            alert('Грешка при създаване на поръчката. Моля, опитайте отново.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="loading-container">
                        <div className="loader"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                <h1 className="checkout-header">Финализиране на поръчка</h1>

                <div className="checkout-content">
                    <form onSubmit={handleSubmit} className="checkout-form">
                        <div className="form-section">
                            <h2>Адрес за доставка</h2>
                            <div className="form-group">
                                <label htmlFor="address">Пълен адрес *</label>
                                <textarea
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                    rows="4"
                                    placeholder="Улица, номер, град, пощенски код"
                                    disabled={submitting}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h2>Метод на плащане</h2>
                            <div className="payment-methods">
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="card"
                                        checked={formData.paymentMethod === 'card'}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        disabled={submitting}
                                    />
                                    <span>Кредитна/Дебитна карта</span>
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="cash"
                                        checked={formData.paymentMethod === 'cash'}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        disabled={submitting}
                                    />
                                    <span>Наложен платеж</span>
                                </label>
                                <label className="payment-option">
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="bank"
                                        checked={formData.paymentMethod === 'bank'}
                                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                                        disabled={submitting}
                                    />
                                    <span>Банков превод</span>
                                </label>
                            </div>

                            {formData.paymentMethod === 'card' && (
                                <div className="card-details">
                                    <div className="form-group">
                                        <label htmlFor="cardNumber">Номер на карта *</label>
                                        <input
                                            type="text"
                                            id="cardNumber"
                                            value={formData.cardNumber}
                                            onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                                            placeholder="1234 5678 9012 3456"
                                            maxLength="19"
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cardName">Име на картата *</label>
                                        <input
                                            type="text"
                                            id="cardName"
                                            value={formData.cardName}
                                            onChange={(e) => setFormData({ ...formData, cardName: e.target.value })}
                                            placeholder="ИМЕ ФАМИЛИЯ"
                                            disabled={submitting}
                                        />
                                    </div>
                                    <div className="form-row">
                                        <div className="form-group">
                                            <label htmlFor="cardExpiry">Валидна до *</label>
                                            <input
                                                type="text"
                                                id="cardExpiry"
                                                value={formData.cardExpiry}
                                                onChange={(e) => setFormData({ ...formData, cardExpiry: e.target.value })}
                                                placeholder="MM/YY"
                                                maxLength="5"
                                                disabled={submitting}
                                            />
                                        </div>
                                        <div className="form-group">
                                            <label htmlFor="cardCVC">CVC код *</label>
                                            <input
                                                type="text"
                                                id="cardCVC"
                                                value={formData.cardCVC}
                                                onChange={(e) => setFormData({ ...formData, cardCVC: e.target.value })}
                                                placeholder="123"
                                                maxLength="3"
                                                disabled={submitting}
                                            />
                                        </div>
                                    </div>
                                    <p className="payment-note">
                                        ⚠️ Това е симулация. Няма реално плащане.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button type="submit" className="submit-button" disabled={submitting}>
                            {submitting ? (
                                <>
                                    <span className="spinner"></span>
                                    Обработва се...
                                </>
                            ) : (
                                'Потвърди поръчката'
                            )}
                        </button>
                    </form>

                    <div className="checkout-summary">
                        <h2>Резюме на поръчката</h2>
                        <div className="summary-items">
                            {cartItems.map((item) => (
                                <div key={item.id} className="summary-item">
                                    <div>
                                        <p className="item-name">{item.product?.title || 'Продукт'}</p>
                                        <p className="item-quantity">Количество: {item.qty || 1}</p>
                                    </div>
                                    <p className="item-price">
                                        {(parseFloat(item.priceAtAdd || item.product?.price || 0) * (item.qty || 1)).toFixed(2)} лв.
                                    </p>
                                </div>
                            ))}
                        </div>
                        <div className="summary-divider"></div>
                        <div className="summary-total">
                            <span>Общо</span>
                            <span>{calculateTotal().toFixed(2)} лв.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
