import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductsByStore, createOrder, getStores } from '../../services/order.service';
import type { Product } from '../../types/products.types';

import { Navbar } from '../../components/consumer/landing/ConsumerNavbar';
import { ProductCard } from '../../components/consumer/store_detail/ProductCard';
import { CartSidebar } from '../../components/consumer/store_detail/CartSidebar';

export interface CartItem extends Product {
    quantity: number;
}

export default function StoreDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);
    const [storeName, setStoreName] = useState("");
    const [loading, setLoading] = useState(true);

    const userid = localStorage.getItem('userid');

    useEffect(() => {
        if (!id) {
            navigate('/consumer');
            return;
        }

        const loadData = async () => {
            try {
                const [productsData, allStores] = await Promise.all([
                    getProductsByStore(id),
                    getStores()
                ]);

                setProducts(productsData);
                const currentStore = allStores.find(s => s.id === id);
                if (currentStore) setStoreName(currentStore.name);
            } catch (err) {
                console.error("Error cargando datos:", err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [id, navigate]);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const addToCart = (product: Product) => {
        setCart(prev => {
            const existing = prev.find(item => item.id === product.id);
            if (existing) {
                return prev.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [...prev, { ...product, quantity: 1 }];
        });
    };

    const removeFromCart = (productid: string) => {
        setCart(prev => prev.filter(item => item.id !== productid));
    };

    const total = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

    const handleFinalize = async () => {
        if (!userid) return alert("Inicia sesión para pedir");

        const orderData = {
            consumerid: userid,
            storeid: id as string,
            total: total,
            items: cart.map(item => ({
                productid: item.id,
                quantity: item.quantity,
                priceattime: item.price
            }))
        };

        try {
            const response = await createOrder(orderData);
            if (response) {
                alert("¡Pedido realizado con éxito!");
                // ESTA ES LA LÍNEA QUE FALTA:
                navigate('/orders');
            }
        } catch (error) {
            console.error("Error:", error);
            alert("No se pudo procesar el pedido");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans">
            <Navbar onLogout={handleLogout} />
            <main className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-10">
                    <h2 className="text-3xl font-black text-gray-800 italic">
                        Menú de <span className="text-orange-500 not-italic">{storeName || "Cargando..."}</span>
                    </h2>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 items-start">
                    <div className="flex-1 space-y-4">
                        {loading ? (
                            <div className="h-28 bg-white animate-pulse rounded-3xl" />
                        ) : (
                            products.map(p => (
                                <ProductCard key={p.id} product={p} onAdd={addToCart} />
                            ))
                        )}
                    </div>

                    <div className="lg:w-80 sticky top-32">
                        <CartSidebar
                            cart={cart}
                            total={total}
                            onRemove={removeFromCart}
                            onFinalize={handleFinalize}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
}
