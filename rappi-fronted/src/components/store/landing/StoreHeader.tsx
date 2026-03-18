import { Store, User, Power } from 'lucide-react';

interface Props {
    name: string;
    userName: string;
    isOpen: boolean;
    onToggle: () => void;
}

export const StoreHeader = ({ name, userName, isOpen, onToggle }: Props) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 mb-10 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex items-center gap-6">
            <div className="bg-orange-100 p-5 rounded-2xl text-orange-500">
                <Store size={40} />
            </div>
            <div>
                <h1 className="text-3xl font-black text-gray-800 italic uppercase leading-none">{name}</h1>
                <p className="flex items-center gap-2 text-gray-400 font-bold text-xs mt-2 uppercase tracking-widest">
                    <User size={14} className="text-orange-400" /> Gestionado por: <span className="text-gray-600">{userName}</span>
                </p>
            </div>
        </div>

        <button
            onClick={onToggle}
            className={`px-8 py-4 rounded-lg font-black text-xs uppercase tracking-[0.2em] flex items-center gap-3 transition-all active:scale-95 shadow-lg ${
                isOpen ? 'bg-green-500 text-white shadow-green-100' : 'bg-red-500 text-white shadow-red-100'
            }`}
        >
            <Power size={18} /> {isOpen ? 'Tienda Abierta' : 'Tienda Cerrada'}
        </button>
    </div>
);
