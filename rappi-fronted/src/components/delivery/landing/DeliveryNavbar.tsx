import { ShoppingBag, LogOut, PackageCheck } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export const DeliveryNavbar = () => {
    const navigate = useNavigate();

    return (
        <nav className="bg-white border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
            <Link to="/delivery-landing" className="flex items-center gap-2">
                <div className="bg-orange-500 p-2 rounded-xl text-white">
                    <ShoppingBag size={20} />
                </div>
                <span className="font-black text-xl italic uppercase tracking-tighter">RappiLab <span className="text-orange-500">Logistics</span></span>
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/delivery-accepted" className="flex items-center gap-2 text-xs font-black uppercase italic hover:text-orange-500 transition-colors">
                    <PackageCheck size={18} />
                    Productos Aceptados
                </Link>

                <button
                    onClick={() => { localStorage.clear(); navigate('/login'); }}
                    className="flex items-center gap-2 text-xs font-black uppercase italic text-red-500 bg-red-50 px-4 py-2 rounded-full"
                >
                    <LogOut size={16} /> Salir
                </button>
            </div>
        </nav>
    );
};
