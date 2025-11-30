import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as THREE from "three";
import ProductService from "../services/ProductService";
import CategoryService from "../services/CategoryService";
import ReviewService from "../services/ReviewService";
import ReviewCard from "../components/ReviewCard";
import RobotLogo from "../components/RobotLogo";
import "./Home.css";

/**
 * Home page component displaying hero section, featured products, categories, and reviews.
 * Includes animated 3D torus knot and product showcase.
 */
export default function Home() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scrollY, setScrollY] = useState(0);
    const [heroSearch, setHeroSearch] = useState("");
    const viewerRef = useRef(null);
    const threeCleanupRef = useRef(null);
    const navigate = useNavigate();

    // Track scroll position for parallax effects
    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Load products, categories, and reviews on mount
    useEffect(() => {
        Promise.all([
            ProductService.getProducts(),
            CategoryService.getCategories(),
            ReviewService.getAllReviews().catch(err => {
                console.warn("Error loading reviews:", err);
                return []; // Return empty array if reviews fail to load
            })
        ])
            .then(([productData, categoryData, reviewData]) => {
                setProducts(productData);
                setCategories(categoryData);
                // Sort reviews by date (newest first) and take latest 6
                const sortedReviews = (reviewData || [])
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 6);
                setReviews(sortedReviews);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Error loading home data:", err);
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        if (loading) return;
        if (!viewerRef.current) return;
        const container = viewerRef.current;
        const sizes = {
            width: container.clientWidth,
            height: container.clientHeight,
        };

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(
            45,
            sizes.width / sizes.height,
            0.1,
            100
        );
        camera.position.z = 4;

        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        container.innerHTML = "";
        container.appendChild(renderer.domElement);

        const geometry = new THREE.TorusKnotGeometry(1, 0.35, 180, 32);
        const material = new THREE.MeshStandardMaterial({
            color: 0xff6b35,
            metalness: 0.5,
            roughness: 0.3,
            emissive: 0x0b0b0b,
        });
        const knot = new THREE.Mesh(geometry, material);
        scene.add(knot);

        const ambient = new THREE.AmbientLight(0xffffff, 0.5);
        const point = new THREE.PointLight(0xff8c42, 1.5);
        point.position.set(3, 4, 5);
        scene.add(ambient, point);

        let animationId;
        const animate = () => {
            knot.rotation.x += 0.01;
            knot.rotation.y += 0.008;
            renderer.render(scene, camera);
            animationId = requestAnimationFrame(animate);
        };
        animate();

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
            geometry.dispose();
            material.dispose();
            renderer.dispose();
        };

        return () => {
            threeCleanupRef.current?.();
        };
    }, [loading]);

    const handleHeroSearch = (event) => {
        event.preventDefault();
        const query = heroSearch.trim();
        if (!query) return;
        navigate(`/catalog?search=${encodeURIComponent(query)}`);
        setHeroSearch("");
    };

    const popularProducts = products.slice(0, 6);
    const featuredCategories = categories.slice(0, 6);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loader"></div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <section className="hero-section">
                <div className="hero-overlay" />
                <div
                    className="hero-grid"
                    style={{ transform: `translateY(${scrollY * 0.2}px)` }}
                >
                    <div className="hero-robot-container">
                        <RobotLogo 
                            animated={true} 
                            size="large" 
                            showText={true}
                            autoPlay={true}
                        />
                    </div>
                    <div className="hero-content">
                        <p className="hero-eyebrow">Бъдещето на творчеството</p>
                        <h1>
                            Създавай. Принтирай.{" "}
                            <span className="gradient-text">Вдъхновявай.</span>
                        </h1>
                        <form className="hero-search" onSubmit={handleHeroSearch}>
                            <input
                                type="text"
                                placeholder="Търси фигури, аксесоари, механизми..."
                                value={heroSearch}
                                onChange={(e) => setHeroSearch(e.target.value)}
                                aria-label="Търси модели"
                            />
                            <button type="submit">Търси</button>
                        </form>
                        <div className="hero-cta">
                            <Link to="/catalog" className="btn btn-primary">
                                Разгледай модели
                            </Link>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/catalog?sort=new")}
                            >
                                Най-нови
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="popular-section">
                <div className="container">
                    <div className="section-headline">
                        <div>
                            <p className="section-eyebrow">Трендове в момента</p>
                            <h2>Популярни модели</h2>
                        </div>
                        <Link to="/catalog" className="text-link">
                            Виж всички
                        </Link>
                    </div>
                    <div className="products-grid">
                        {popularProducts.map((product) => (
                            <Link
                                key={product.id}
                                to={`/product/${product.id}`}
                                className="product-card tilt-card"
                            >
                                <div className="product-image-wrapper">
                                    {product.mainImageUrl ? (
                                        <img
                                            src={product.mainImageUrl}
                                            alt={product.title}
                                            className="product-image"
                                        />
                                    ) : (
                                        <div className="product-placeholder">3D</div>
                                    )}
                                    <span className="product-badge">Готов за FDM</span>
                                </div>
                                <div className="product-info">
                                    <h3>{product.title || "3D модел"}</h3>
                                    <p>
                                        {product.description?.substring(0, 70) ||
                                            "Готов за незабавен печат."}
                                    </p>
                                    <div className="product-meta">
                                        <span>
                                            {product.price
                                                ? `${product.price} ${product.currency || "лв."}`
                                                : "По заявка"}
                                        </span>
                                        <button type="button">Преглед</button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="categories-section">
                <div className="container">
                    <div className="section-headline">
                        <div>
                            <p className="section-eyebrow">Разгледай по категории</p>
                            <h2>Категории</h2>
                        </div>
                        <Link to="/catalog" className="text-link">
                            Всички категории
                        </Link>
                    </div>
                    <div className="categories-grid">
                        {featuredCategories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/catalog?category=${category.id}`}
                                className="category-card"
                            >
                                <div className="category-icon">
                                    <span>{category.name?.charAt(0) || "C"}</span>
                                </div>
                                <h3>{category.name}</h3>
                                <p>Открий модели в {category.name}</p>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="viewer-section">
                <div className="container viewer-grid">
                    <div className="viewer-canvas" ref={viewerRef} />
                    <div className="viewer-info">
                        <p className="section-eyebrow">Интерактивен преглед</p>
                        <h2>Виж модела преди да го изтеглиш</h2>
                        <p>
                            Интерактивният 3D преглед с Three.js ти позволява да завърташ
                            и приближаваш модела, за да оцениш детайлите, преди да
                            започнеш печат.
                        </p>
                        <ul>
                            <li>Завъртане и инспекция на модела</li>
                            <li>Живо осветление и отражения</li>
                            <li>Опция за изтегляне на STL/OBJ</li>
                        </ul>
                        <div className="viewer-actions">
                            <Link to="/catalog" className="btn btn-primary">
                                Демонстрация
                            </Link>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/catalog?tag=featured")}
                            >
                                Препоръчани модели
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <section className="reviews-section">
                <div className="container">
                    <div className="section-headline">
                        <div>
                            <p className="section-eyebrow">Отзиви от клиенти</p>
                            <h2>Ревюта от потребителите</h2>
                        </div>
                        <Link to="/catalog" className="text-link">
                            Виж всички продукти
                        </Link>
                    </div>

                    {reviews.length > 0 ? (
                        <div className="reviews-grid">
                            {reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-reviews">
                            <p>Все още няма ревюта. Бъдете първият, който сподели мнението си!</p>
                            <Link to="/catalog" className="btn btn-primary">
                                Разгледай продукти
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
