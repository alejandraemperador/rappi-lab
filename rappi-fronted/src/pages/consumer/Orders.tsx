import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from '../../components/consumer/landing/ConsumerNavbar';
import { getUserOrders } from '../../services/order.service';
import { OrderCard } from '../../components/consumer/my_orders/OrderCard';
import { Package } from 'lucide-react';

export default function Orders() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const userid = localStorage.getItem('userid');

    useEffect(() => {
        if (!userid) { navigate('/login'); return; }

        const fetchOrders = async () => {
            try {
                const data = await getUserOrders(userid);
                setOrders(data);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
        const interval = setInterval(fetchOrders, 10000);
        return () => clearInterval(interval);
    }, [userid]);

    const groupedOrders = orders.reduce((acc: any, order) => {
        const storename = order.store_name || "Tienda";
        if (!acc[storename]) acc[storename] = { items: [], subtotal: 0 };

        // Añade el encadenamiento opcional (?.) para evitar errores
        order.items?.forEach((item: any) => {
            const price = Number(item.price || item.priceattime || 0);
            acc[storename].items.push({
                ...item,
                price: price, // Normaliza el nombre del precio
                deliveryid: order.deliveryid,
                orderId: order.id
            });
            acc[storename].subtotal += (price * item.quantity);
        });

        return acc;
    }, {});

    const totalGeneral = orders.reduce((acc, o) => acc + Number(o.total), 0);

    return (
        <div className="min-h-screen bg-[#F8F9FA] font-sans pb-20">
            <Navbar onLogout={() => { localStorage.clear(); navigate('/login'); }} />

            <main className="max-w-4xl mx-auto px-6 py-12">

                <div className="flex items-center gap-4 mb-10">
                    <div className="bg-orange-500 p-2 rounded-xl text-white">
                        <Package size={20} />
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 italic uppercase">Mis <span className="text-orange-500 not-italic">Pedidos</span></h2>
                </div>

                <div className="space-y-12">
                    {loading ? (
                        <div className="animate-pulse space-y-4"><div className="h-32 bg-white rounded-3xl" /></div>
                    ) : Object.keys(groupedOrders).map(storename => (
                        <div key={storename} className="space-y-4">
                            <h3 className="text-xl font-black text-orange-500 italic ml-2 tracking-tight">{storename}</h3>

                            <div className="space-y-3">
                                {groupedOrders[storename].items.map((item: any, index: number) => (
                                    <OrderCard key={`${item.id}-${index}`} item={item} />
                                ))}
                            </div>

                            <div className="bg-orange-500 rounded-2xl p-3 flex justify-between items-center px-8 shadow-lg shadow-orange-100">
                                <span className="text-white font-black italic text-lg">Subtotal:</span>
                                <span className="text-white font-black text-lg">${groupedOrders[storename].subtotal.toLocaleString()}</span>
                            </div>
                        </div>
                    ))}

                    <div className="bg-orange-600 rounded-2xl p-4 flex justify-between items-center px-8 mt-10">
                        <span className="text-white font-black text-lg italic uppercase tracking-tighter">Total de mis pedidos:</span>
                        <span className="text-white font-black text-3xl">${totalGeneral.toLocaleString()}</span>
                    </div>
                </div>
            </main>
        </div>
    );
}
