import { Package } from 'lucide-react';

export const EmptyOrders = () => (
    <div className="text-center py-32 bg-white rounded-[50px] border border-dashed border-gray-200">
        <Package size={32} className="mx-auto text-gray-200 mb-4" />
        <h2 className="text-gray-800 font-black uppercase italic text-sm tracking-widest">
            No hay pedidos
        </h2>
        <p className="text-gray-400 font-bold text-[10px] uppercase mt-2">
            Los pedidos de tus clientes aparecerán aquí.
        </p>
    </div>
);
