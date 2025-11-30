import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import ProductService from "../services/ProductService";
import CategoryService from "../services/CategoryService";
import "./Catalog.css";

export default function Catalog() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredProduct, setHoveredProduct] = useState(null);
    const productsPerPage = 12;

    useEffect(() => {
        const categoryId = searchParams.get("category");
        const searchQuery = searchParams.get("search");
        
        const fetchData = async () => {
            try {
                setLoading(true);
                
                // Fetch categories
                const categoriesData = await CategoryService.getCategories();
                setCategories(categoriesData);
                
                // Fetch products
                let productsData;
                if (categoryId) {
                    productsData = await ProductService.getByCategory(categoryId);
                    const categoryInfo = categoriesData.find(cat => cat.id === parseInt(categoryId));
                    setSelectedCategory(categoryInfo);
                } else {
                    productsData = await ProductService.getProducts();
                    setSelectedCategory(null);
                }
                
                // Apply search filter if present
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    productsData = productsData.filter(product => 
                        product.title?.toLowerCase().includes(query) ||
                        product.description?.toLowerCase().includes(query)
                    );
                }
                
                setProducts(productsData);
                setCurrentPage(1); // Reset to first page on filter change
                setError(null);
            } catch (err) {
                console.error("Error loading catalog:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    const handleCategoryFilter = (categoryId) => {
        if (categoryId === selectedCategory?.id) {
            // Deselect if already selected
            const newParams = new URLSearchParams(searchParams);
            newParams.delete("category");
            setSearchParams(newParams);
        } else {
            const newParams = new URLSearchParams(searchParams);
            newParams.set("category", categoryId);
            setSearchParams(newParams);
        }
    };

    // Pagination
    const totalPages = Math.ceil(products.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = products.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    if (loading) {
        return (
            <div className="catalog-page">
                <div className="catalog-loading">
                    <div className="catalog-loader"></div>
                    <p>Зареждане на продукти...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="catalog-page">
                <div className="catalog-error">
                    <h2>Грешка при зареждане</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn-retry">
                        Опитай отново
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="catalog-page">
            <div className="catalog-header">
                <div className="container">
                    <h1 className="catalog-title">Каталог с 3D Модели</h1>
                    <div className="catalog-title-line"></div>
                    <p className="catalog-subtitle">Принтирани с прецизност, избрани с внимание.</p>
                </div>
            </div>

            <div className="catalog-filters">
                <div className="container">
                    <div className="filters-bar">
                        <div className="filter-category-pills">
                            <button
                                type="button"
                                className={`filter-pill ${!selectedCategory ? "active" : ""}`}
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete("category");
                                    setSearchParams(newParams);
                                }}
                            >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="2" x2="12" y2="6" />
                                    <line x1="12" y1="18" x2="12" y2="22" />
                                    <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
                                    <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
                                    <line x1="2" y1="12" x2="6" y2="12" />
                                    <line x1="18" y1="12" x2="22" y2="12" />
                                    <line x1="4.93" y1="19.07" x2="7.76" y2="16.24" />
                                    <line x1="16.24" y1="7.76" x2="19.07" y2="4.93" />
                                </svg>
                                <span>Всички</span>
                            </button>
                            {categories.map((category) => (
                                <button
                                    key={category.id}
                                    type="button"
                                    className={`filter-pill ${selectedCategory?.id === category.id ? "active" : ""}`}
                                    onClick={() => handleCategoryFilter(category.id)}
                                >
                                    <span>{category.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="catalog-content">
                <div className="container">
                    {selectedCategory && (
                        <div className="selected-category-info">
                            <button
                                type="button"
                                className="clear-filter-btn"
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete("category");
                                    setSearchParams(newParams);
                                }}
                            >
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <line x1="18" y1="6" x2="6" y2="18" />
                                    <line x1="6" y1="6" x2="18" y2="18" />
                                </svg>
                            </button>
                            <span>Категория: <strong>{selectedCategory.name}</strong></span>
                        </div>
                    )}

                    {products.length === 0 ? (
                        <div className="catalog-empty">
                            <p>Няма намерени продукти.</p>
                        </div>
                    ) : (
                        <>
                            <div className="products-grid">
                                {currentProducts.map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.id}`}
                                        className={`product-card ${hoveredProduct === product.id ? "hovered" : ""}`}
                                        onMouseEnter={() => setHoveredProduct(product.id)}
                                        onMouseLeave={() => setHoveredProduct(null)}
                                    >
                                        <div className="product-image-wrapper">
                                            {product.mainImageUrl || (product.images && product.images.length > 0 && product.images[0]?.imageUrl) ? (
                                                <img
                                                    src={product.mainImageUrl || product.images[0]?.imageUrl}
                                                    alt={product.title || "3D модел"}
                                                    className="product-image"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        e.target.nextElementSibling.style.display = 'flex';
                                                    }}
                                                />
                                            ) : null}
                                            <div className="product-placeholder" style={{ display: product.mainImageUrl || (product.images && product.images.length > 0) ? 'none' : 'flex' }}>
                                                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <rect x="3" y="3" width="18" height="18" rx="2" />
                                                    <path d="M9 9h6M9 15h6" />
                                                </svg>
                                            </div>
                                            <div className="product-card-glow"></div>
                                            <div className="product-corner-animation"></div>
                                            <div className="product-wireframe-overlay"></div>
                                        </div>
                                        <div className="product-info">
                                            <h3 className="product-title">{product.title || "3D Модел"}</h3>
                                            {product.description && (
                                                <p className="product-description">
                                                    {product.description.length > 80
                                                        ? `${product.description.substring(0, 80)}...`
                                                        : product.description}
                                                </p>
                                            )}
                                            <div className="product-footer">
                                                <span className="product-price">
                                                    {product.price !== undefined && product.price !== null
                                                        ? `${product.price} ${product.currency || "лв."}`
                                                        : "По заявка"}
                                                </span>
                                                <button type="button" className="product-view-btn">
                                                    Преглед
                                                </button>
                                            </div>
                                        </div>
                                        <div className="product-glow-line"></div>
                                    </Link>
                                ))}
                            </div>

                            {totalPages > 1 && (
                                <div className="catalog-pagination">
                                    <button
                                        type="button"
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage - 1)}
                                        disabled={currentPage === 1}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M15 18l-6-6 6-6" />
                                        </svg>
                                        <span>Предишна</span>
                                    </button>
                                    
                                    <div className="pagination-numbers">
                                        {[...Array(totalPages)].map((_, index) => {
                                            const page = index + 1;
                                            if (
                                                page === 1 ||
                                                page === totalPages ||
                                                (page >= currentPage - 1 && page <= currentPage + 1)
                                            ) {
                                                return (
                                                    <button
                                                        key={page}
                                                        type="button"
                                                        className={`pagination-number ${currentPage === page ? "active" : ""}`}
                                                        onClick={() => handlePageChange(page)}
                                                    >
                                                        {page}
                                                    </button>
                                                );
                                            } else if (page === currentPage - 2 || page === currentPage + 2) {
                                                return <span key={page} className="pagination-ellipsis">...</span>;
                                            }
                                            return null;
                                        })}
                                    </div>
                                    
                                    <button
                                        type="button"
                                        className="pagination-btn"
                                        onClick={() => handlePageChange(currentPage + 1)}
                                        disabled={currentPage === totalPages}
                                    >
                                        <span>Следваща</span>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 18l6-6-6-6" />
                                        </svg>
                                    </button>
                                </div>
                            )}

                            <div className="catalog-results-count">
                                Показва се {currentProducts.length} от {products.length} продукт{products.length !== 1 ? "а" : ""}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
