import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminRoute from '../../components/AdminRoute';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import './AdminProductForm.css';

export default function AdminProductEdit() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        currency: 'BGN',
        categoryId: '',
        stock: '',
        material: '',
        dimensions: '',
        weight: '',
        mainImageUrl: '',
        imageUrls: ['']
    });

    const loadData = useCallback(async () => {
        try {
            const [product, categoriesData] = await Promise.all([
                ProductService.getById(id),
                CategoryService.getCategories()
            ]);

            setCategories(Array.isArray(categoriesData) ? categoriesData : []);
            
            if (product) {
                // Extract image URLs from images array
                const imageUrls = product.images && product.images.length > 0
                    ? product.images.map(img => img.imageUrl || '').filter(Boolean)
                    : [''];
                
                setFormData({
                    title: product.title || '',
                    description: product.description || '',
                    price: product.price || '',
                    currency: product.currency || 'BGN',
                    categoryId: product.category?.id || '',
                    stock: product.stock || '',
                    material: product.material || '',
                    dimensions: product.dimensions || '',
                    weight: product.weight || '',
                    mainImageUrl: product.mainImageUrl || '',
                    imageUrls: imageUrls.length > 0 ? imageUrls : ['']
                });
            }
        } catch (error) {
            console.error('Error loading product:', error);
            navigate('/admin/products');
        } finally {
            setLoading(false);
        }
    }, [id, navigate]);

    useEffect(() => {
        loadData();
    }, [id, navigate, loadData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);

        // Prepare images array from imageUrls
        const images = formData.imageUrls
            .filter(url => url.trim() !== '')
            .map((url, index) => ({
                // Explicitly set id to null to ensure they are treated as new images
                id: null,
                imageUrl: url.trim(),
                altText: `${formData.title} - Image ${index + 1}`,
                orderIndex: index
            }));

        const productData = {
            id: parseInt(id), // Ensure product ID is included
            title: formData.title,
            description: formData.description || null,
            price: parseFloat(formData.price),
            currency: formData.currency || 'BGN',
            stock: parseInt(formData.stock) || 0,
            material: formData.material || null,
            dimensions: formData.dimensions || null,
            weight: formData.weight ? parseFloat(formData.weight) : null,
            mainImageUrl: formData.mainImageUrl || null,
            category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null,
            images: images.length > 0 ? images : []
        };

        try {
            await ProductService.update(id, productData);
            navigate('/admin/products');
        } catch (error) {
            console.error('Error updating product:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                productData: productData
            });
            
            // Show detailed error message
            let errorMessage = 'Error updating product';
            if (error.response?.data) {
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            alert(`Error updating product: ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    const addImageUrl = () => {
        setFormData({
            ...formData,
            imageUrls: [...formData.imageUrls, '']
        });
    };

    const removeImageUrl = (index) => {
        const newImageUrls = formData.imageUrls.filter((_, i) => i !== index);
        setFormData({
            ...formData,
            imageUrls: newImageUrls.length > 0 ? newImageUrls : ['']
        });
    };

    const updateImageUrl = (index, value) => {
        const newImageUrls = [...formData.imageUrls];
        newImageUrls[index] = value;
        setFormData({
            ...formData,
            imageUrls: newImageUrls
        });
    };

    return (
        <AdminRoute>
            {loading ? (
                <div className="admin-product-form">
                    <div className="container">
                        <div className="loading-container">
                            <div className="loader"></div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="admin-product-form">
            <div className="container">
                <div className="form-header">
                    <Link to="/admin/products" className="back-link">← Назад</Link>
                    <h1>Редактирай продукт</h1>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-section">
                        <h2>Основна информация</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="title">Заглавие *</label>
                                <input
                                    type="text"
                                    id="title"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="categoryId">Категория</label>
                                <select
                                    id="categoryId"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    disabled={saving}
                                >
                                    <option value="">Избери категория</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">Описание</label>
                            <textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows="6"
                                disabled={saving}
                                placeholder="Описание на продукта..."
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Цена и наличност</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">Цена (лв.) *</label>
                                <input
                                    type="number"
                                    id="price"
                                    step="0.01"
                                    min="0"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    required
                                    disabled={saving}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="stock">Наличност</label>
                                <input
                                    type="number"
                                    id="stock"
                                    min="0"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    disabled={saving}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Допълнителна информация</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="material">Материал</label>
                                <input
                                    type="text"
                                    id="material"
                                    value={formData.material}
                                    onChange={(e) => setFormData({ ...formData, material: e.target.value })}
                                    disabled={saving}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="dimensions">Размери</label>
                                <input
                                    type="text"
                                    id="dimensions"
                                    value={formData.dimensions}
                                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                                    placeholder="например: 10x10x5 cm"
                                    disabled={saving}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="weight">Тегло (кг)</label>
                            <input
                                type="number"
                                id="weight"
                                step="0.01"
                                min="0"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                disabled={saving}
                            />
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>Изображения</h2>
                        <div className="form-group">
                            <label htmlFor="mainImageUrl">URL на главно изображение *</label>
                            <input
                                type="url"
                                id="mainImageUrl"
                                value={formData.mainImageUrl}
                                onChange={(e) => setFormData({ ...formData, mainImageUrl: e.target.value })}
                                placeholder="https://example.com/main-image.jpg"
                                disabled={saving}
                                required
                            />
                            <p className="form-note">
                                Главното изображение се показва в каталога и като първо изображение на страницата на продукта.
                            </p>
                            {formData.mainImageUrl && (
                                <div className="image-preview">
                                    <img src={formData.mainImageUrl} alt="Преглед" onError={(e) => e.target.style.display = 'none'} />
                                </div>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Допълнителни изображения</label>
                            {formData.imageUrls.map((url, index) => (
                                <div key={index} className="image-url-row">
                                    <input
                                        type="url"
                                        value={url}
                                        onChange={(e) => updateImageUrl(index, e.target.value)}
                                        placeholder={`https://example.com/image-${index + 1}.jpg`}
                                        disabled={saving}
                                        className="image-url-input"
                                    />
                                    {formData.imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageUrl(index)}
                                            className="remove-image-btn"
                                            disabled={saving}
                                        >
                                            ×
                                        </button>
                                    )}
                                    {url && (
                                        <div className="image-preview-small">
                                            <img src={url} alt={`Преглед ${index + 1}`} onError={(e) => e.target.style.display = 'none'} />
                                        </div>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addImageUrl}
                                className="add-image-btn"
                                disabled={saving}
                            >
                                + Добави още изображение
                            </button>
                            <p className="form-note">
                                Добавете URL-и на допълнителни изображения. Те ще се показват в галерията на страницата на продукта.
                            </p>
                        </div>
                    </div>

                    <div className="form-actions">
                        <Link to="/admin/products" className="button-secondary">
                            Отказ
                        </Link>
                        <button type="submit" className="button-primary" disabled={saving}>
                            {saving ? 'Запазване...' : 'Запази промените'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
            )}
        </AdminRoute>
    );
}
