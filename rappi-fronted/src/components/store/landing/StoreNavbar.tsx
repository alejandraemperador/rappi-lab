import { useNavigate, Link } from 'react-router-dom';
import { LogOut, ClipboardList } from 'lucide-react';

export const StoreNavbar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    return (
        <nav className="bg-white border-b border-gray-100 py-5 px-10 flex justify-between items-center sticky top-0 z-50 shadow-sm">
            <div className="flex items-center gap-4">

                <Link
                    to="/store-landing"
                    className="text-2xl font-black text-gray-800 hover:opacity-80 transition-opacity flex items-center gap-2"
                >
                    <span>
                        Rappi<span className="text-orange-500">Lab</span>
                    </span>

                    <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded-lg font-black uppercase tracking-tighter">
                        Store
                    </span>
                </Link>
            </div>

            <div className="flex items-center gap-6 text-gray-500 font-bold text-sm">

                <button
                    onClick={() => navigate('/store-orders')}
                    className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                >
                    <ClipboardList size={18} /> Pedidos Entrantes
                </button>

                <span className="text-gray-300">|</span>

                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 hover:text-red-500 transition-colors"
                >
                    <LogOut size={18} /> Salir
                </button>
            </div>
        </nav>
    );
};
