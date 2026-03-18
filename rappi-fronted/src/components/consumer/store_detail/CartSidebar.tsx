import { ShoppingBasket, Trash2 } from 'lucide-react';
import type { CartItem } from '../../../pages/consumer/StoreDetail'; // Importamos el tipo

interface CartSidebarProps {
    cart: CartItem[];
    total: number;
    onRemove: (id: string) => void;
    onFinalize: () => void;
}

export const CartSidebar = ({ cart, total, onRemove, onFinalize }: CartSidebarProps) => (
    <div className="bg-white rounded-2xl p-6 shadow-xl shadow-gray-200/50 border border-gray-50 animate-in fade-in duration-500">
        <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-500 p-2 rounded-lg text-white">
                <ShoppingBasket size={18} />
            </div>
            <h3 className="text-lg font-black text-gray-800 tracking-tight">Tu Pedido</h3>
        </div>

        <div className="space-y-4 mb-8 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
            {cart.length > 0 ? (
                cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-start group">
                        <div className="flex-1">
                            <p className="font-bold text-gray-700 text-sm leading-tight">
                                {item.name} <span className="text-orange-500 ml-1">x{item.quantity}</span>
                            </p>
                            <p className="text-gray-400 font-black text-xs mt-1">${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-gray-300 hover:text-red-500 transition-colors ml-2"
                        >
                            <Trash2 size={14} />
                        </button>
                    </div>
                ))
            ) : (
                <p className="text-center text-gray-400 py-6 italic text-xs font-medium uppercase tracking-widest">Carrito vacío</p>
            )}
        </div>

        <div className="border-t border-dashed border-gray-100 pt-5">
            <div className="flex justify-between items-center mb-6">
                <span className="text-gray-400 font-bold text-[10px] uppercase tracking-tighter">Total</span>
                <span className="text-2xl font-black text-gray-800">${total.toLocaleString()}</span>
            </div>

            <button
                disabled={cart.length === 0}
                onClick={onFinalize}
                className={`w-full py-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg ${
                    cart.length > 0
                    ? 'bg-orange-500 text-white hover:bg-orange-600 shadow-orange-100'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
            >
                Finalizar Pedido
            </button>
        </div>
    </div>
);
