import { useEffect, useState } from 'react';
import { StoreNavbar } from '../../components/store/landing/StoreNavbar';
import { StoreHeader } from '../../components/store/landing/StoreHeader';
import { ProductForm } from '../../components/store/landing/ProductForm';
import { ProductCard } from '../../components/store/landing/ProductCard';
import { getMyStore, toggleStoreStatus, createProduct, deleteProduct } from '../../services/store.service';
import { getProductsByStore } from '../../services/order.service';

export default function StoreLanding() {
    const [store, setStore] = useState<any>(null);
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: '', price: '', imageUrl: '', description: '' });

    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName') || '';

    const loadData = async () => {
        if (!userId) return;
        try {
            const storeData = await getMyStore(userId);
            setStore(storeData);
            const productsData = await getProductsByStore(storeData.id);
            setProducts(productsData);
        } catch (error) {
            console.error("Error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [userId]);

    const handleAddProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createProduct({ ...form, storeId: store.id, price: Number(form.price) });
            setForm({ name: '', price: '', imageUrl: '', description: '' });
            loadData();
        } catch (err) { alert("Error al crear producto"); }
    };

    const handleDeleteProduct = async (id: string) => {
        try {
            await deleteProduct(id);
            loadData();
        } catch (error) {
            alert("No se pudo eliminar el producto.");
        }
    };

    if (loading) return <div className="p-20 font-black text-orange-500 italic animate-pulse text-center">Cargando RappiLab Store...</div>;

    return (
        <div className="min-h-screen bg-[#F8F9FA] pb-20">
            <StoreNavbar />

            <main className="max-w-6xl mx-auto px-6 py-10">
                <StoreHeader
                    name={store?.name}
                    userName={userName}
                    isOpen={store?.isopen}
                    onToggle={async () => setStore(await toggleStoreStatus(store.id, !store.isopen))}
                />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    <aside>
                        <ProductForm form={form} setForm={setForm} onSubmit={handleAddProduct} />
                    </aside>

                    <section className="lg:col-span-2">
                        <div className="flex items-center gap-3 mb-6 ml-2">
                            <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                            <h2 className="text-xl font-black text-gray-800 italic uppercase">Menú de la Tienda</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {products.map(product => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onDelete={handleDeleteProduct}
                                />
                            ))}
                        </div>

                        {products.length === 0 && (
                            <div className="text-center py-20 bg-white rounded-[40px] border border-dashed border-gray-200">
                                <p className="text-gray-400 font-bold italic uppercase text-xs tracking-widest">Aún no tienes productos</p>
                            </div>
                        )}
                    </section>
                </div>
            </main>
        </div>
    );
}
