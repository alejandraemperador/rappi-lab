import { ShoppingBag, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
    onLogout: () => void;
}

export const Navbar = ({ onLogout }: NavbarProps) => {
    const navigate = useNavigate();

    return (
        <nav className="flex justify-between items-center px-10 py-5 bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
            <h1
                onClick={() => navigate('/consumer')}
                className="text-2xl font-black text-gray-800 cursor-pointer hover:opacity-80 transition-opacity"
            >
                Rappi<span className="text-orange-500">Lab</span>
            </h1>

            <div className="flex items-center gap-6 text-gray-500 font-bold text-sm">
                <button
                    onClick={() => navigate('/orders')} 
                    className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                >
                    <ShoppingBag size={18} /> Mis pedidos
                </button>
                <span className="text-gray-300">|</span>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 hover:text-orange-500 transition-colors"
                >
                    <LogOut size={18} /> Salir
                </button>
            </div>
        </nav>
    );
};
