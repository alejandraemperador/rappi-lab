import { Plus } from 'lucide-react';
import type { Product } from '../../../types/products.types';

interface ProductCardProps {
    product: Product;
    onAdd: (product: Product) => void;
}

export const ProductCard = ({ product, onAdd }: ProductCardProps) => (
    <div className="bg-white p-4 rounded-2xl flex justify-between items-center border border-transparent hover:border-orange-100 transition-all shadow-sm hover:shadow-md group">
        <div className="flex gap-5 items-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden shrink-0">
                {product.imageurl ? (
                    <img
                        src={product.imageurl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300 font-bold text-[10px] p-2 text-center">
                        NO IMAGE
                    </div>
                )}
            </div>

            <div>
                <h4 className="font-black text-gray-800 text-lg leading-tight">{product.name}</h4>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{product.description || "Disponible ahora"}</p>
                <p className="text-orange-500 font-black text-base mt-1">${product.price.toLocaleString()}</p>
            </div>
        </div>

        <button
            onClick={() => onAdd(product)}
            className="bg-gray-50 text-gray-400 p-4 rounded-2xl hover:bg-orange-500 hover:text-white hover:shadow-lg hover:shadow-orange-100 transition-all active:scale-90"
        >
            <Plus size={20} />
        </button>
    </div>
);
