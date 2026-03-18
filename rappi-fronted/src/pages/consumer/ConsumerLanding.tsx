import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStores } from '../../services/order.service';
import type { Store } from '../../types/stores.types';

import { Navbar } from '../../components/consumer/landing/ConsumerNavbar';
import { WelcomeBanner } from '../../components/consumer/landing/WelcomeBanner';
import { StoreCard } from '../../components/consumer/landing/StoreCard';

export default function ConsumerLanding() {
    const navigate = useNavigate();
    const [stores, setStores] = useState<Store[]>([]);
    const username = localStorage.getItem('username') || 'usuario';

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const allStores = await getStores();
                const openStores = allStores.filter(s => s.isopen === true);
                setStores(openStores);
            } catch (error) {
                console.error("Error al traer tiendas:", error);
            }
        };
        fetchStores();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <Navbar onLogout={handleLogout} />
            <WelcomeBanner username={username} />

            <main className="max-w-6xl mx-auto px-10 py-12">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
                    <h3 className="text-xl font-black text-gray-800">Tiendas disponibles</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stores.length > 0 ? (
                        stores.map((store) => (
                            <StoreCard
                                key={store.id}
                                store={store}
                                onClick={(id) => navigate(`/store/${id}`, { state: { storename: store.name } })}
                            />
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20">
                            <p className="text-gray-400 font-bold text-lg italic underline decoration-orange-300">
                                No hay tiendas abiertas en este momento...
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
