import { useState, useEffect } from 'react';
import { getProduct, deleteProduct } from '../services/api';
import InventoryBadge from './InventoryBadge';

function ProductList({ refreshTrigger }) {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadProducts();
    }, [refreshTrigger]);

    const loadProducts = async () => {
        setLoading(true);
        const productPromises = [];
        for (let i = 1; i <= 10; i++) {
            productPromises.push(
                getProduct(i).catch(() => null)
            );
        }

        const results = await Promise.all(productPromises);
        const validProducts = results
            .filter(r => r && r.data)
            .map(r => r.data);

        setProducts(validProducts);
        setLoading(false);
    };

    const handleDelete = async (productId) => {
        if (!window.confirm('¿Eliminar este producto? Se emitirá el evento product.deleted')) {
            return;
        }

        try {
            await deleteProduct(productId);
            alert('✅ Producto eliminado! Evento product.deleted emitido.');
            loadProducts();
        } catch (error) {
            alert('Error al eliminar: ' + (error.response?.data?.message || error.message));
        }
    };

    if (loading && products.length === 0) {
        return <div className="loading">Loading products...</div>;
    }

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <p>No products found. Create your first product!</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            <h2>Products</h2>
            <div className="products-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-header">
                            <h3>{product.title || `Product #${product.id}`}</h3>
                            <InventoryBadge productId={product.id} />
                        </div>

                        <p className="product-code">{product.code || 'No code'}</p>
                        <p className="product-description">
                            {product.description || 'No description'}
                        </p>

                        <div className="product-meta">
                            <span className={`status ${product.isActive ? 'active' : 'inactive'}`}>
                                {product.isActive ? '✓ Active' : '○ Inactive'}
                            </span>
                            <span className="category">{product.category?.name}</span>
                        </div>

                        <button
                            onClick={() => handleDelete(product.id)}
                            className="delete-btn"
                            style={{
                                marginTop: '1rem',
                                width: '100%',
                                background: '#dc3545',
                            }}
                        >
                            🗑️ Delete Product
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;