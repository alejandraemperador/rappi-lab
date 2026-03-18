import { useEffect, useState } from 'react';
import { DeliveryNavbar } from '../../components/delivery/landing/DeliveryNavbar';
import { getAcceptedOrders, updateOrderStatus } from '../../services/delivery.service';
import { CheckCircle, MapPin, Package } from 'lucide-react';

export default function AcceptedOrders() {
    const [orders, setOrders] = useState<any[]>([]);
    const deliveryid = localStorage.getItem('userid');

    const loadAccepted = async () => {
        if (!deliveryid) return;
        const data = await getAcceptedOrders(deliveryid);
        setOrders(data);
    };

    useEffect(() => {
        loadAccepted();
    }, []);

    const handleComplete = async (id: string) => {
        try {
            await updateOrderStatus(id, 'delivered');
            alert("¡Pedido entregado con éxito!");
            loadAccepted();
        } catch (e) {
            alert("Error al finalizar la entrega");
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F9FA]">
            <DeliveryNavbar />
            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-black uppercase italic mb-8 text-orange-600">Mis Entregas Activas</h1>

                <div className="grid gap-6">
                    {orders.map(order => (
                        <div key={order.id} className="bg-white p-6 rounded-[30px] shadow-sm border-l-8 border-green-500 flex flex-col gap-4">
                            <div className="flex justify-between items-center">
                                <h2 className="font-black text-gray-800 uppercase italic">Pedido #{order.id.split('-')[0]}</h2>
                                <span className="text-[10px] font-black bg-green-100 text-green-700 px-3 py-1 rounded-full uppercase">En camino</span>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-2xl">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Destino:</p>
                                <p className="text-sm font-black text-gray-700 flex items-center gap-2">
                                    <MapPin size={16} className="text-red-500"/> {order.customer_name}
                                </p>
                            </div>
                            <div className="space-y-2">
                                {order.items?.map((item: any, i: number) => (
                                    <div key={i} className="flex items-center gap-3 text-xs font-bold text-gray-600">
                                        <Package size={14} className="text-orange-400"/>
                                        <span>{item.quantity}x {item.product_name}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handleComplete(order.id)}
                                className="w-full bg-green-600 text-white py-4 rounded-[20px] font-black uppercase text-xs hover:bg-green-700 transition-all flex items-center justify-center gap-2 mt-2 shadow-lg shadow-green-500/20"
                            >
                                <CheckCircle size={18}/> Finalizar Entrega
                            </button>
                        </div>
                    ))}
                    {orders.length === 0 && (
                        <div className="text-center py-20">
                            <p className="font-bold text-gray-400 uppercase italic text-xs">No tienes entregas pendientes.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
