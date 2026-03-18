import { useEffect, useState } from 'react';
import { StoreNavbar } from '../../components/store/landing/StoreNavbar';
import { getStoreOrders } from '../../services/order.service';
import { getMyStore } from '../../services/store.service';
import { OrderCard } from '../../components/store/orders/OrderCard';
import { EmptyOrders } from '../../components/store/orders/EmptyOrders';

export default function StoreOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const userId = localStorage.getItem('userId');

    const loadOrders = async () => {
        if (!userId) return;
        try {
            const store = await getMyStore(userId);
            const data = await getStoreOrders(store.id);
            setOrders(data);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
        const interval = setInterval(loadOrders, 5000);
        return () => clearInterval(interval);
    }, [userId]);

    if (loading) return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <StoreNavbar />
            <div className="p-20 text-center font-black text-orange-500 animate-pulse uppercase italic">
                Sincronizando con la cocina...
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20">
            <StoreNavbar />

            <main className="max-w-5xl mx-auto px-6 py-10">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-2 h-8 bg-orange-500 rounded-full shadow-lg"></div>
                    <h1 className="text-3xl font-black text-gray-800 italic uppercase tracking-tighter">
                        Pedidos Entrantes
                    </h1>
                </div>

                <div className="grid gap-6">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <OrderCard key={order.id} order={order} />
                        ))
                    ) : (
                        <EmptyOrders />
                    )}
                </div>
            </main>
        </div>
    );
}
