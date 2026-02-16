import { useState, useEffect } from 'react';
import { login } from './services/api';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import './App.css';

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const isExpired = payload.exp * 1000 < Date.now();

                if (isExpired) {
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                } else {
                    setIsAuthenticated(true);
                }
            } catch (e) {
                localStorage.removeItem('token');
                setIsAuthenticated(false);
            }
        }
    }, []);

    const handleLogin = async () => {
        setLoading(true);
        try {
            const response = await login('admin@admin.com', '12345678');

            const token = response.accessToken ||
                response.access_token ||
                response.data?.accessToken ||
                response.data?.access_token;

            if (!token) {
                throw new Error('No token received');
            }

            localStorage.setItem('token', token);
            setIsAuthenticated(true);
        } catch (error) {
            alert('Login failed. Make sure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
    };

    const handleProductCreated = () => {
        setRefreshTrigger(prev => prev + 1);
    };

    if (!isAuthenticated) {
        return (
            <div className="login-container">
                <div className="login-box">
                    <h1>E-Commerce Event-Driven Demo</h1>
                    <p>Login with admin account to continue</p>
                    <button onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login as Admin'}
                    </button>
                    <p className="help-text">
                        Email: admin@admin.com<br />
                        Password: 12345678
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <header className="app-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1>🛍️ E-Commerce Event-Driven Architecture Demo</h1>
                        <p>NestJS Backend + React Frontend with Asynchronous Events</p>
                    </div>
                    <button onClick={handleLogout} style={{ height: 'fit-content' }}>
                        Logout
                    </button>
                </div>
            </header>

            <main className="app-main">
                <section className="section">
                    <ProductForm onProductCreated={handleProductCreated} />
                </section>

                <section className="section">
                    <ProductList refreshTrigger={refreshTrigger} />
                </section>
            </main>

            <footer className="app-footer">
                <p>
                    💡 <strong>Event-Driven Flow:</strong> When you create a product, the backend emits a
                    <code>product.created</code> event. The InventoryListener reacts asynchronously and
                    creates initial inventory. The stock badge polls every 5 seconds to show the update.
                </p>
            </footer>
        </div>
    );
}

export default App;