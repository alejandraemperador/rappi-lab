import { Plus } from 'lucide-react';

interface Props {
    form: any;
    setForm: (form: any) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export const ProductForm = ({ form, setForm, onSubmit }: Props) => (
    <form onSubmit={onSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
        <h3 className="font-black text-gray-800 uppercase text-sm mb-6 flex items-center gap-2 italic">
            <Plus size={20} className="text-orange-500" /> Nuevo Producto
        </h3>
        <div className="space-y-3">
            <input required className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold"
                placeholder="Nombre" value={form.name} onChange={e=>setForm({...form, name: e.target.value})} />
            <input required type="number" className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold"
                placeholder="Precio ($)" value={form.price} onChange={e=>setForm({...form, price: e.target.value})} />
            <input className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold"
                placeholder="URL Imagen" value={form.imageUrl} onChange={e=>setForm({...form, imageUrl: e.target.value})} />
            <textarea className="w-full p-4 bg-gray-50 rounded-2xl border-none text-sm font-bold min-h-25"
                placeholder="Descripción" value={form.description} onChange={e=>setForm({...form, description: e.target.value})} />
            <button className="w-full bg-orange-500 text-white py-4 rounded-lg font-black uppercase text-[10px] tracking-widest shadow-xl hover:bg-orange-600 transition-all mt-4">
                Guardar Producto
            </button>
        </div>
    </form>
);
