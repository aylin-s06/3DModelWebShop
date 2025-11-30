import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AdminRoute from '../../components/AdminRoute';
import ProductService from '../../services/ProductService';
import CategoryService from '../../services/CategoryService';
import './AdminProductForm.css';

export default function AdminProductNew() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const data = await CategoryService.getCategories();
            setCategories(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Prepare images array from imageUrls
            const images = formData.imageUrls
                .filter(url => url.trim() !== '')
                .map((url, index) => ({
                    imageUrl: url.trim(),
                    altText: `${formData.title} - Изображение ${index + 1}`,
                    orderIndex: index
                }));

            const productData = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock) || 0,
                weight: formData.weight ? parseFloat(formData.weight) : null,
                category: formData.categoryId ? { id: parseInt(formData.categoryId) } : null,
                images: images.length > 0 ? images : null
            };
            delete productData.categoryId;
            delete productData.imageUrls;

            await ProductService.create(productData);
            navigate('/admin/products');
        } catch (error) {
            console.error('Error creating product:', error);
            alert('Грешка при създаване на продукта');
        } finally {
            setLoading(false);
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
            <div className="admin-product-form">
            <div className="container">
                <div className="form-header">
                    <Link to="/admin/products" className="back-link">← Назад</Link>
                    <h1>Добави нов продукт</h1>
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
                                    disabled={loading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="categoryId">Категория</label>
                                <select
                                    id="categoryId"
                                    value={formData.categoryId}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    disabled={loading}
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
                                disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                    disabled={loading}
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
                                disabled={loading}
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
                                disabled={loading}
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
                                        disabled={loading}
                                        className="image-url-input"
                                    />
                                    {formData.imageUrls.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageUrl(index)}
                                            className="remove-image-btn"
                                            disabled={loading}
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
                                disabled={loading}
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
                        <button type="submit" className="button-primary" disabled={loading}>
                            {loading ? 'Запазване...' : 'Запази продукт'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </AdminRoute>
    );
}
