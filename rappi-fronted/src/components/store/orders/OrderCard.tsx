import { ShoppingBag, User, Package, Truck, Clock } from 'lucide-react';

interface OrderCardProps {
    order: any;
}

export const OrderCard = ({ order }: OrderCardProps) => {
    return (
        <div className="bg-white rounded-[35px] p-8 shadow-sm border border-gray-50 flex flex-col md:flex-row gap-8 transition-all hover:shadow-md">

            <div className="flex-1">
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-orange-50 p-2 rounded-xl text-orange-500">
                        <ShoppingBag size={18} />
                    </div>
                    <span className="text-xs font-black text-gray-800 italic uppercase">
                        #{order.id.split('-')[0]}
                    </span>
                    <span className={`ml-auto px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${
                        order.status === 'pending' ? 'bg-orange-100 text-orange-600' :
                        order.status === 'accepted' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                    }`}>
                        {order.status}
                    </span>
                </div>

                <h3 className="flex items-center gap-2 font-black text-gray-800 uppercase text-sm mb-4">
                    <User size={16} className="text-orange-500" />
                    Cliente: <span className="text-gray-500">{order.consumer_name}</span>
                </h3>

                <div className="space-y-2">
                    {order.items?.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center bg-gray-50/50 p-3 rounded-2xl border border-gray-50">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white rounded-lg overflow-hidden border border-gray-100">
                                    {item.imageurl ? (
                                        <img src={item.imageurl} className="w-full h-full object-cover" alt={item.name} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-200">
                                            <Package size={14}/>
                                        </div>
                                    )}
                                </div>
                                <span className="text-xs font-bold text-gray-700">{item.quantity}x {item.name}</span>
                            </div>
                            <span className="text-xs font-black text-gray-400">
                                ${Number(item.price).toLocaleString()}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="md:w-72 flex flex-col justify-between border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-8">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 italic">
                        Repartidor Asignado
                    </p>
                    {order.delivery_name ? (
                        <div className="bg-blue-50 p-5 rounded-[25px] border border-blue-100">
                            <p className="flex items-center gap-2 text-blue-700 font-black text-[11px] uppercase">
                                <Truck size={16} className="animate-bounce" /> {order.delivery_name}
                            </p>
                            <p className="text-[9px] text-blue-400 font-bold mt-1 uppercase tracking-tighter">
                                ¡Ya tomó tu pedido!
                            </p>
                        </div>
                    ) : (
                        <div className="bg-gray-50 p-5 rounded-[25px] border border-dashed border-gray-200 flex flex-col items-center justify-center">
                            <Clock size={18} className="text-gray-300 mb-1" />
                            <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">
                                Buscando Delivery...
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-8 bg-gray-900 p-6 rounded-[25px] text-white">
                    <p className="text-[9px] font-black text-gray-500 uppercase italic mb-1 tracking-widest">
                        Pago Total
                    </p>
                    <p className="text-2xl font-black text-orange-500 tracking-tighter">
                        ${Number(order.total).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};
