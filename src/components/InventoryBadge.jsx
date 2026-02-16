import { useState, useEffect } from 'react';
import { getInventory } from '../services/api';

function InventoryBadge({ productId }) {
    const [inventory, setInventory] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadInventory();

        // Poll every 5 seconds to show async updates
        const interval = setInterval(loadInventory, 5000);

        return () => clearInterval(interval);
    }, [productId]);

    const loadInventory = async () => {
        try {
            const response = await getInventory(productId);
            setInventory(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error loading inventory:', error);
            setLoading(false);
        }
    };

    if (loading) {
        return <span className="badge loading">Loading...</span>;
    }

    if (!inventory) {
        return <span className="badge error">No inventory</span>;
    }

    const stockLevel = inventory.quantity;
    const badgeClass = stockLevel === 0 ? 'out-of-stock' :
        stockLevel < 10 ? 'low-stock' : 'in-stock';

    return (
        <span className={`badge ${badgeClass}`}>
            Stock: {stockLevel}
        </span>
    );
}

export default InventoryBadge;