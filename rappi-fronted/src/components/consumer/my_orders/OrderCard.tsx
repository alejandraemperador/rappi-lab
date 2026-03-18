export const OrderCard = ({ item }: { item: any }) => {
    const isAccepted = !!item.deliveryid;

    return (
        <div className="bg-white p-5 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl overflow-hidden shadow-inner">
                    <img
                        src={item.image || "https://via.placeholder.com/150"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                    />
                </div>
                <div>
                    <h4 className="font-black text-gray-800 text-sm uppercase tracking-tight">{item.name}</h4>
                    <p className="text-[9px] text-gray-400 font-bold mb-1 uppercase">Cantidad: {item.quantity}</p>
                    <p className="text-orange-500 font-black text-sm">${Number(item.price).toLocaleString()}</p>
                </div>
            </div>

            <div className="text-right">
                <p className="text-[10px] text-gray-400 font-semibold uppercase mb-2 tracking-tighter leading-none">
                    ESTADO DE ACEPTACIÓN <br/> DEL REPARTIDOR
                </p>
                <div className={`px-5 py-1.5 rounded-full font-black text-[10px] tracking-widest inline-block ${
                    isAccepted
                    ? 'bg-green-100 text-green-600 border border-green-200'
                    : 'bg-red-50 text-red-500 border border-red-100'
                }`}>
                    {isAccepted ? 'ACEPTADO' : 'PENDIENTE'}
                </div>
            </div>
        </div>
    );
};
