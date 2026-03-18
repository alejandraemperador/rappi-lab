import { Trash2, Image as ImageIcon } from 'lucide-react';

interface ProductCardProps {
    product: any;
    onDelete: (id: string) => void;
}

export const ProductCard = ({ product, onDelete }: ProductCardProps) => {
    return (
        <div className="bg-white p-4 rounded-2xl border border-gray-100 flex justify-between items-center shadow-sm hover:shadow-md transition-all group">
            <div className="flex items-center gap-4 flex-1">
                <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex items-center justify-center border border-gray-100">
                    {product.imageurl ? (
                        <img src={product.imageurl} className="w-full h-full object-cover" alt={product.name} />
                    ) : (
                        <ImageIcon size={24} className="text-gray-200" />
                    )}
                </div>
                <div className="flex-1 pr-2">
                    <h4 className="font-black text-gray-800 uppercase text-[11px] tracking-tight">{product.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold leading-tight my-1 uppercase line-clamp-2">
                        {product.description || "Sin descripción"}
                    </p>
                    <p className="text-orange-500 font-black text-sm">
                        ${Number(product.price).toLocaleString()}
                    </p>
                </div>
            </div>
            <button
                onClick={() => onDelete(product.id)}
                className="p-3 text-gray-200 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};
