import { useState, useEffect } from 'react';
import { getProduct } from '../services/api';
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
        for (let i = 1; i <= 5; i++) {
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
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ProductList;