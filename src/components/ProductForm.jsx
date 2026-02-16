import { useState } from 'react';
import { createProduct, addProductDetails, activateProduct } from '../services/api';

function ProductForm({ onProductCreated }) {
    const [step, setStep] = useState(1);
    const [productId, setProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        categoryId: 1,
        title: '',
        code: '',
        description: '',
        brand: '',
        series: '',
        capacity: '',
        capacityUnit: 'GB',
        capacityType: 'SSD',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleCreateProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await createProduct(parseInt(formData.categoryId));
            setProductId(response.data.id);
            setStep(2);
            console.log('Product created, inventory should be created asynchronously');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create product');
        } finally {
            setLoading(false);
        }
    };

    const handleAddDetails = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const details = {
                title: formData.title,
                code: formData.code,
                variationType: 'NONE',
                description: formData.description,
                about: ['High quality product', 'Fast shipping'],
                details: {
                    category: formData.categoryId === 1 ? 'Computers' : 'Fashion',
                    brand: formData.brand,
                    series: formData.series,
                    capacity: parseInt(formData.capacity),
                    capacityUnit: formData.capacityUnit,
                    capacityType: formData.capacityType,
                },
            };

            await addProductDetails(productId, details);
            setStep(3);
        } catch (err) {
            setError(err.response?.data?.errors?.[0] || 'Failed to add details');
        } finally {
            setLoading(false);
        }
    };

    const handleActivate = async () => {
        setLoading(true);
        setError(null);

        try {
            await activateProduct(productId);
            alert('Product activated! Event emitted asynchronously.');
            if (onProductCreated) onProductCreated();
            resetForm();
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to activate product');
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setStep(1);
        setProductId(null);
        setFormData({
            categoryId: 1,
            title: '',
            code: '',
            description: '',
            brand: '',
            series: '',
            capacity: '',
            capacityUnit: 'GB',
            capacityType: 'SSD',
        });
    };

    return (
        <div className="product-form">
            <h2>Create New Product</h2>

            {error && <div className="error">{error}</div>}

            {step === 1 && (
                <form onSubmit={handleCreateProduct}>
                    <div className="form-group">
                        <label>Category:</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                        >
                            <option value="1">Computers</option>
                            <option value="2">Fashion</option>
                        </select>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Creating...' : 'Create Product'}
                    </button>

                    <p className="help-text">
                        ℹ️ Creating a product will trigger the <code>product.created</code> event,
                        which will automatically create inventory asynchronously.
                    </p>
                </form>
            )}

            {step === 2 && (
                <form onSubmit={handleAddDetails}>
                    <h3>Product #{productId} - Add Details</h3>

                    <div className="form-group">
                        <label>Title:</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Code:</label>
                        <input
                            type="text"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Description:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Brand:</label>
                        <input
                            type="text"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Series:</label>
                        <input
                            type="text"
                            name="series"
                            value={formData.series}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Capacity:</label>
                            <input
                                type="number"
                                name="capacity"
                                value={formData.capacity}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Unit:</label>
                            <select
                                name="capacityUnit"
                                value={formData.capacityUnit}
                                onChange={handleChange}
                            >
                                <option value="GB">GB</option>
                                <option value="TB">TB</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Type:</label>
                            <select
                                name="capacityType"
                                value={formData.capacityType}
                                onChange={handleChange}
                            >
                                <option value="SSD">SSD</option>
                                <option value="HD">HD</option>
                            </select>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Add Details'}
                    </button>
                    <button type="button" onClick={resetForm} disabled={loading}>
                        Cancel
                    </button>
                </form>
            )}

            {step === 3 && (
                <div>
                    <h3>Product #{productId} - Ready to Activate</h3>
                    <p>All details added. Ready to activate?</p>

                    <button onClick={handleActivate} disabled={loading}>
                        {loading ? 'Activating...' : 'Activate Product'}
                    </button>
                    <button onClick={resetForm} disabled={loading}>
                        Create Another
                    </button>

                    <p className="help-text">
                        ℹ️ Activating will trigger the <code>product.activated</code> event.
                    </p>
                </div>
            )}
        </div>
    );
}

export default ProductForm;