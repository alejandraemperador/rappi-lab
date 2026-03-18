import { Store as StoreIcon } from 'lucide-react';
import type { Store } from '../../../types/stores.types'

interface StoreCardProps {
    store: Store;
    onClick: (id: string) => void;
}

export const StoreCard = ({ store, onClick }: StoreCardProps) => (
    <div
        onClick={() => onClick(store.id)}
        className="bg-white p-6 rounded-2xl flex items-center gap-5 cursor-pointer shadow-sm hover:shadow-xl border border-gray-100 transition-all group hover:-translate-y-1"
    >
        <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
            <StoreIcon size={35} />
        </div>
        <div className="flex flex-col gap-1">
            <h4 className="font-extrabold text-gray-800 text-lg group-hover:text-orange-600 transition-colors">
                {store.name}
            </h4>
            <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">
                    Abierta ahora
                </span>
            </div>
        </div>
    </div>
);
