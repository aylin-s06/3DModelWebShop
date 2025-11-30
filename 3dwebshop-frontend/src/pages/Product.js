import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef, useCallback } from "react";
import * as THREE from "three";
import { useAuth } from "../contexts/AuthContext";
import ProductService from "../services/ProductService";
import CartService from "../services/CartService";
import ReviewService from "../services/ReviewService";
import ReviewCard from "../components/ReviewCard";
import "./Product.css";

/**
 * Product detail page component.
 * Displays product information, images, 3D viewer, reviews, and related products.
 * Allows adding to cart and submitting reviews.
 */
export default function Product() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [product, setProduct] = useState(null);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [addingToCart, setAddingToCart] = useState(false);
    const [addToCartMessage, setAddToCartMessage] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loadingReviews, setLoadingReviews] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
    const [submittingReview, setSubmittingReview] = useState(false);
    const viewerRef = useRef(null);
    const threeCleanupRef = useRef(null);

    /**
     * Loads reviews for the current product.
     * Memoized with useCallback to prevent unnecessary re-renders.
     */
    const loadReviews = useCallback(async () => {
        try {
            setLoadingReviews(true);
            const reviewsData = await ReviewService.getByProduct(id);
            setReviews(reviewsData || []);
        } catch (error) {
            console.error("Error loading reviews:", error);
            setReviews([]);
        } finally {
            setLoadingReviews(false);
        }
    }, [id]);

    // Load product data, related products, and reviews
    useEffect(() => {
        ProductService.getById(id)
            .then(data => {
                setProduct(data);
                setLoading(false);
                
                // Load related products from same category
                if (data.category?.id) {
                    ProductService.getByCategory(data.category.id)
                        .then(products => {
                            // Filter out current product
                            const related = products.filter(p => p.id !== data.id).slice(0, 4);
                            setRelatedProducts(related);
                        })
                        .catch(err => console.error("Error loading related products:", err));
                }
            })
            .catch(err => {
                console.error("Error loading product:", err);
                setLoading(false);
            });
        
        // Load reviews for this product
        loadReviews();
    }, [id, loadReviews]);

    /**
     * Handles review form submission.
     * Requires user authentication.
     * 
     * @param {Event} e - Form submit event
     */
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!isAuthenticated || !user) {
            navigate('/login', { state: { returnTo: `/product/${id}` } });
            return;
        }

        setSubmittingReview(true);
        try {
            await ReviewService.createReview(user.id, id, {
                rating: reviewForm.rating,
                comment: reviewForm.comment
            });
            setReviewForm({ rating: 5, comment: '' });
            setShowReviewForm(false);
            await loadReviews();
        } catch (error) {
            console.error("Error submitting review:", error);
            alert('Error adding review');
        } finally {
            setSubmittingReview(false);
        }
    };

    // 3D Viewer setup
    useEffect(() => {
        if (!product || !viewerRef.current) return;

        const container = viewerRef.current;
        const width = container.clientWidth;
        const height = container.clientHeight;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0a0a0a);

        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.innerHTML = "";
        container.appendChild(renderer.domElement);

        // Create a 3D model representation (low-poly style)
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff6b00,
            emissive: 0xff6b00,
            emissiveIntensity: 0.3,
            metalness: 0.8,
            roughness: 0.2,
        });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        // Add wireframe
        const wireframe = new THREE.WireframeGeometry(geometry);
        const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0xff6b00 }));
        scene.add(line);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        const pointLight = new THREE.PointLight(0xff6b00, 1, 100);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const spotLight = new THREE.SpotLight(0xff6b00, 2);
        spotLight.position.set(0, 5, 0);
        scene.add(spotLight);

        // Mouse controls
        let isDragging = false;
        let previousMousePosition = { x: 0, y: 0 };

        const onMouseDown = (e) => {
            isDragging = true;
        };

        const onMouseUp = () => {
            isDragging = false;
        };

        const onMouseMove = (e) => {
            if (!isDragging) return;

            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;

            mesh.rotation.y += deltaX * 0.01;
            mesh.rotation.x += deltaY * 0.01;
            line.rotation.y += deltaX * 0.01;
            line.rotation.x += deltaY * 0.01;

            previousMousePosition = { x: e.clientX, y: e.clientY };
        };

        container.addEventListener("mousedown", onMouseDown);
        container.addEventListener("mouseup", onMouseUp);
        container.addEventListener("mousemove", onMouseMove);
        container.addEventListener("mouseleave", onMouseUp);

        // Auto rotation
        let animationId;
        const animate = () => {
            if (!isDragging) {
                mesh.rotation.y += 0.005;
                line.rotation.y += 0.005;
            }
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };
        animate();

        // Handle resize
        const handleResize = () => {
            const newWidth = container.clientWidth;
            const newHeight = container.clientHeight;
            renderer.setSize(newWidth, newHeight);
            camera.aspect = newWidth / newHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", handleResize);

        threeCleanupRef.current = () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener("resize", handleResize);
            container.removeEventListener("mousedown", onMouseDown);
            container.removeEventListener("mouseup", onMouseUp);
            container.removeEventListener("mousemove", onMouseMove);
            container.removeEventListener("mouseleave", onMouseUp);
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };

        return () => {
            threeCleanupRef.current?.();
        };
    }, [product]);

    const handleAddToCart = async () => {
        if (!isAuthenticated || !user) {
            // Redirect to login if not authenticated
            navigate('/login', { state: { returnTo: `/product/${id}` } });
            return;
        }

        if (!product || !product.id) {
            alert('Грешка: Продуктът не е зареден');
            return;
        }

        setAddingToCart(true);
        setAddToCartMessage(null);

        try {
            const cartItem = {
                product: { id: product.id },
                qty: quantity,
                priceAtAdd: product.price || 0
            };

            await CartService.addToCart(user.id, cartItem);
            
            // Show success message
            setAddToCartMessage('Продуктът е добавен в количката!');
            
            // Clear message after 3 seconds
            setTimeout(() => {
                setAddToCartMessage(null);
            }, 3000);

            // Optionally navigate to cart after a short delay
            // setTimeout(() => navigate('/cart'), 1500);
        } catch (error) {
            console.error('Error adding to cart:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Грешка при добавяне в количката';
            setAddToCartMessage(`Грешка: ${errorMessage}`);
            setTimeout(() => {
                setAddToCartMessage(null);
            }, 3000);
        } finally {
            setAddingToCart(false);
        }
    };

    const allImages = product?.images?.length > 0 
        ? [product.mainImageUrl, ...product.images.map(img => img.imageUrl)].filter(Boolean)
        : product?.mainImageUrl 
            ? [product.mainImageUrl] 
            : [];

    if (loading) {
        return (
            <div className="product-loading">
                <div className="loader"></div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-not-found">
                <h1>Продуктът не е намерен</h1>
                <Link to="/catalog" className="btn btn-primary">Върни се към каталога</Link>
            </div>
        );
    }

    return (
        <div className="product-page">
            <div className="product-container">
                {/* Breadcrumb */}
                <nav className="breadcrumb">
                    <Link to="/">Начало</Link>
                    <span>/</span>
                    <Link to="/catalog">Каталог</Link>
                    {product.category && (
                        <>
                            <span>/</span>
                            <Link to={`/catalog?category=${product.category.id}`}>
                                {product.category.name}
                            </Link>
                        </>
                    )}
                    <span>/</span>
                    <span>{product.title}</span>
                </nav>

                {/* Main Product Section */}
                <div className="product-main">
                    {/* Image Gallery */}
                    <div className="product-gallery">
                        <div className="main-image">
                            {allImages[selectedImage] ? (
                                <img
                                    src={allImages[selectedImage]}
                                    alt={product.title}
                                    className="product-main-image"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        const placeholder = e.target.nextElementSibling;
                                        if (placeholder) placeholder.style.display = 'flex';
                                    }}
                                />
                            ) : null}
                            <div className="image-placeholder" style={{ display: allImages[selectedImage] ? 'none' : 'flex' }}>
                                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                    <path d="M9 9h6M9 15h6" />
                                </svg>
                                <span>Няма изображение</span>
                            </div>
                        </div>
                        {allImages.length > 1 && (
                            <div className="image-thumbnails">
                                {allImages.map((img, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        className={`thumbnail ${selectedImage === index ? "active" : ""}`}
                                        onClick={() => setSelectedImage(index)}
                                    >
                                        <img src={img} alt={`${product.title} ${index + 1}`} />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 3D Viewer */}
                    <div className="product-3d-viewer">
                        <h3>3D Преглед</h3>
                        <div className="viewer-container" ref={viewerRef}></div>
                        <p className="viewer-hint">Завърти модела с мишката</p>
                    </div>

                    {/* Product Info */}
                    <div className="product-info">
                        <div className="product-header">
                            <h1 className="product-title">{product.title}</h1>
                            {product.category && (
                                <Link
                                    to={`/catalog?category=${product.category.id}`}
                                    className="product-category"
                                >
                                    {product.category.name}
                                </Link>
                            )}
                        </div>

                        <div className="product-price-section">
                            <div className="price">
                                {product.price !== undefined && product.price !== null ? (
                                    <>
                                        <span className="price-amount">
                                            {product.price} {product.currency || "лв."}
                                        </span>
                                    </>
                                ) : (
                                    <span className="price-amount">По заявка</span>
                                )}
                            </div>
                            {product.stock !== undefined && (
                                <div className={`stock ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                                    {product.stock > 0 ? `✓ В наличност (${product.stock})` : "✗ Изчерпан"}
                                </div>
                            )}
                        </div>

                        <div className="product-description">
                            <h3>Описание</h3>
                            <p>{product.description || "Няма описание."}</p>
                        </div>

                        {/* Product Details */}
                        <div className="product-details">
                            <h3>Детайли</h3>
                            <div className="details-grid">
                                {product.material && (
                                    <div className="detail-item">
                                        <span className="detail-label">Материал:</span>
                                        <span className="detail-value">{product.material}</span>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="detail-item">
                                        <span className="detail-label">Размери:</span>
                                        <span className="detail-value">{product.dimensions}</span>
                                    </div>
                                )}
                                {product.weight && (
                                    <div className="detail-item">
                                        <span className="detail-label">Тегло:</span>
                                        <span className="detail-value">{product.weight} g</span>
                                    </div>
                                )}
                                {product.files && product.files.length > 0 && (
                                    <div className="detail-item">
                                        <span className="detail-label">Файлове:</span>
                                        <span className="detail-value">
                                            {product.files.length} файл{product.files.length !== 1 ? "а" : ""}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="product-actions">
                            <div className="quantity-selector">
                                <label htmlFor="quantity">Количество:</label>
                                <div className="quantity-controls">
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        disabled={quantity <= 1 || addingToCart}
                                    >
                                        −
                                    </button>
                                    <input
                                        id="quantity"
                                        type="number"
                                        min="1"
                                        max={product.stock || 999}
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        disabled={addingToCart}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setQuantity(Math.min(product.stock || 999, quantity + 1))}
                                        disabled={quantity >= (product.stock || 999) || addingToCart}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="add-to-cart-section">
                                <button
                                    type="button"
                                    className="btn btn-primary btn-add-to-cart"
                                    onClick={handleAddToCart}
                                    disabled={!product.stock || product.stock === 0 || addingToCart}
                                >
                                    {addingToCart ? 'Добавяне...' : 'Добави в количката'}
                                </button>
                                {addToCartMessage && (
                                    <div className={`cart-message ${addToCartMessage.includes('Грешка') ? 'error' : 'success'}`}>
                                        {addToCartMessage}
                                        {!addToCartMessage.includes('Грешка') && (
                                            <Link to="/cart" className="view-cart-link">
                                                Виж количката →
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className="product-reviews-section">
                    <div className="reviews-header">
                        <h2>Ревюта ({reviews.length})</h2>
                        {isAuthenticated && user && (
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => setShowReviewForm(!showReviewForm)}
                            >
                                {showReviewForm ? 'Отказ' : 'Напиши ревю'}
                            </button>
                        )}
                    </div>

                    {showReviewForm && isAuthenticated && user && (
                        <form className="review-form" onSubmit={handleSubmitReview}>
                            <div className="form-group">
                                <label htmlFor="rating">Рейтинг *</label>
                                <div className="rating-input">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            className={`star-btn ${star <= reviewForm.rating ? 'active' : ''}`}
                                            onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                                        >
                                            ★
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label htmlFor="comment">Коментар</label>
                                <textarea
                                    id="comment"
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                    rows="4"
                                    placeholder="Сподели мнението си за продукта..."
                                    disabled={submittingReview}
                                />
                            </div>
                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={submittingReview || reviewForm.rating < 1}
                            >
                                {submittingReview ? 'Изпращане...' : 'Изпрати ревю'}
                            </button>
                        </form>
                    )}

                    {loadingReviews ? (
                        <div className="reviews-loading">
                            <div className="loader"></div>
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="reviews-list">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <div className="no-reviews">
                            <p>Все още няма ревюта за този продукт. Бъдете първият!</p>
                        </div>
                    )}
                </section>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <section className="related-products">
                        <h2>Свързани продукти</h2>
                        <div className="related-grid">
                            {relatedProducts.map((relatedProduct) => (
                                <Link
                                    key={relatedProduct.id}
                                    to={`/product/${relatedProduct.id}`}
                                    className="related-card"
                                >
                                    {relatedProduct.mainImageUrl ? (
                                        <img
                                            src={relatedProduct.mainImageUrl}
                                            alt={relatedProduct.title}
                                            className="related-image"
                                        />
                                    ) : (
                                        <div className="related-placeholder">3D</div>
                                    )}
                                    <div className="related-info">
                                        <h4>{relatedProduct.title}</h4>
                                        <p className="related-price">
                                            {relatedProduct.price
                                                ? `${relatedProduct.price} ${relatedProduct.currency || "лв."}`
                                                : "По заявка"}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}
