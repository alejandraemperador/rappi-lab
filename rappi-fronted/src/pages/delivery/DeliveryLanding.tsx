import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeliveryNavbar } from '../../components/delivery/landing/DeliveryNavbar';
import { getAvailableOrders, acceptOrder } from '../../services/delivery.service';
import { Truck, MapPin, DollarSign } from 'lucide-react';

export default function DeliveryLanding() {
    const [orders, setOrders] = useState<any[]>([]);
    const deliveryId = localStorage.getItem('userId');
    const navigate = useNavigate();

    const loadAvailable = async () => {
        try {
            const data = await getAvailableOrders();
            setOrders(data);
        } catch (error) {
            console.error("Error al cargar pedidos:", error);
        }
    };

    useEffect(() => {
        loadAvailable();
        const interval = setInterval(loadAvailable, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleAccept = async (id: string) => {
        if (!deliveryId) return alert("No se encontró ID de repartidor. Por favor, inicia sesión.");

        try {
            await acceptOrder(id, deliveryId);
            alert("¡Pedido aceptado! Redirigiendo a tus entregas...");
            navigate('/delivery-accepted');
        } catch (e) {
            alert("Error al aceptar el pedido. Intenta de nuevo.");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <DeliveryNavbar />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-black uppercase italic mb-8">Pedidos en el radar</h1>
                <div className="grid gap-6">
                    {orders.length > 0 ? (
                        orders.map(order => (
                            <div key={order.id} className="bg-white p-6 rounded-[30px] shadow-sm border border-gray-100 flex flex-col gap-4">
                                {/* Cabecera: ID y Monto Total */}
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">Disponible ahora</p>
                                        <h2 className="font-black text-gray-800 text-lg uppercase italic">
                                            Pedido #{order.id.split('-')[0]}
                                        </h2>
                                    </div>
                                    <span className="flex items-center gap-1 text-xs font-black text-green-600 bg-green-50 px-3 py-1 rounded-full border border-green-100">
                                        <DollarSign size={14} /> {Number(order.total).toLocaleString()}
                                    </span>
                                </div>
                                <hr className="border-gray-50" />
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-gray-50 p-3 rounded-2xl">
                                        <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Recoger en (Tienda):</p>
                                        <p className="text-sm font-black text-gray-700 flex items-center gap-1">
                                            <MapPin size={14} className="text-orange-500" />
                                            {order.store_name || "Tienda no especificada"}
                                        </p>
                                    </div>
                                    <div className="bg-gray-50 p-3 rounded-2xl">
                                        <p className="text-[9px] uppercase font-bold text-gray-400 mb-1">Entregar a (Cliente):</p>
                                        <p className="text-sm font-black text-gray-700 uppercase">
                                            {order.customer_name || "Cliente anónimo"}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    {order.items && order.items.map((item: any, index: number) => (
                                        <div key={index} className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-gray-50">
                                            <img
                                                src={item.product_image || "https://via.placeholder.com/50"}
                                                className="w-12 h-12 rounded-xl object-cover border border-gray-100"
                                                alt={item.product_name}
                                            />
                                            <div className="flex-1">
                                                <p className="text-xs font-black text-gray-800 uppercase leading-tight">
                                                    {item.product_name}
                                                </p>
                                                <p className="text-[10px] font-bold text-gray-400">
                                                    Cant: {item.quantity} x ${Number(item.product_price).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    onClick={() => handleAccept(order.id)}
                                    className="w-full bg-orange-500 text-white py-4 rounded-[20px] font-black uppercase italic text-xs hover:bg-orange-600 transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                                >
                                    <Truck size={18} /> Aceptar Pedido
                                </button>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 opacity-40">
                            <Truck size={48} className="text-gray-300 mb-4" />
                            <p className="text-center font-bold text-gray-400 uppercase italic text-xs tracking-widest">
                                No hay pedidos disponibles en el radar...
                            </p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
