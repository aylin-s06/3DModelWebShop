import React, { useEffect, useState } from "react";
import axios from "../axios";

/**
 * Catalog component that displays a grid of products.
 * Fetches products from the backend API and renders them in a responsive grid layout.
 */
const Catalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch products from backend API
        axios.get("/products")
            .then(res => {
                // Extract product field from response items
                const mappedProducts = res.data.map(item => item.product);
                setProducts(mappedProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading products:", err);
                setLoading(false);
            });
    }, []);

    if (loading) return <p>Loading products...</p>;
    if (products.length === 0) return <p>No products found.</p>;

    return (
        <div className="catalog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            {products.map(product => (
                <div key={product.id} className="product-card" style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "15px" }}>
                    <img
                        src={product.mainImageUrl}
                        alt={product.title}
                        style={{ width: "100%", height: "200px", objectFit: "cover", borderRadius: "10px" }}
                    />
                    <h3>{product.title}</h3>
                    <p>{product.description}</p>
                    <p style={{ fontWeight: "bold" }}>{product.price} {product.currency}</p>
                </div>
            ))}
        </div>
    );
};

export default Catalog;
