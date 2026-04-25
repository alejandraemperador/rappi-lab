import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserRole } from '../../../types/auth.types';
import { register } from '../../../services/auth.service';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [formdata, setFormData] = useState({
        //Este es el objeto que guarda todo lo que el usuario escribe.
        name: '',
        email: '',
        password: '',
        role: UserRole.CONSUMER as UserRole,
        //empieza por defecto en consumer
        storename: ''
    });

    //Se ejecuta cuando envías el formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Aseguramos que si es STORE, el storename no sea una cadena vacía
        // Aquí preparas lo que vas a mandar al backend
        const dataToSend = {
            name: formdata.name.trim(),
            email: formdata.email.trim(),
            password: formdata.password,
            role: formdata.role,
            storename: formdata.role === UserRole.STORE ? formdata.storename.trim() : undefined
            //Si el rol es tienda, envía el nombre de la tienda.
            // Si NO es tienda, ponlo como undefined (no lo envía)
        };

        try {
            await register(dataToSend);
            //haces POST a /register, llamada al backend
            alert("¡Registro completo! Ahora puedes iniciar sesión.");
            navigate('/login');
        } catch (error: any) {
            // Agregamos un alert para saber qué falló exactamente
            alert(error.response?.data?.message || "Error en el registro");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50 p-4 font-sans">
            <form
                onSubmit={handleSubmit}
                //cuando envías registro → ejecuta handleSubmit
                className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md flex flex-col gap-4 border-t-8 border-orange-500"
            >
                <div className="text-center mb-2">
                    <h2 className="text-3xl font-black text-gray-800">Crea tu <span className="text-orange-500">Cuenta</span></h2>
                    <p className="text-gray-400 text-sm">Completa tus datos para empezar</p>
                </div>

                <div className="flex flex-col gap-3">
                    <input
                        className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-orange-400 bg-gray-50 transition-all"
                        type="text"
                        placeholder="Tu nombre completo"
                        required
                        //guarda el nombre en formdata
                        onChange={(e) => setFormData({ ...formdata, name: e.target.value })}
                    />

                    <input
                        className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-orange-400 bg-gray-50 transition-all"
                        type="email"
                        placeholder="correo@ejemplo.com"
                        required
                        onChange={(e) => setFormData({ ...formdata, email: e.target.value })}
                    />

                    <input
                        className="border-2 border-gray-100 p-3 rounded-xl outline-none focus:border-orange-400 bg-gray-50 transition-all"
                        type="password"
                        placeholder="Contraseña segura"
                        required
                        onChange={(e) => setFormData({ ...formdata, password: e.target.value })}
                    />

                    <div className="flex flex-col gap-1">
                        <label className="text-xs font-bold text-gray-400 uppercase ml-1">¿Qué quieres hacer?</label>
                        <select
                            className="border-2 border-orange-100 p-3 rounded-xl outline-none bg-orange-50 text-orange-700 font-bold"
                            value={formdata.role}// muestra el rol actual
                            onChange={(e) => setFormData({ ...formdata, role: e.target.value as UserRole })}
                            //actualiza el rol
                        >
                            <option value={UserRole.CONSUMER}>Quiero comprar comida</option>
                            <option value={UserRole.STORE}>Tengo un Restaurante / Tienda</option>
                            <option value={UserRole.DELIVERY}>Quiero ser Repartidor</option>
                        </select>
                    </div>

                    {formdata.role === UserRole.STORE && (
                        //SOLO se muestra si eliges “store”
                        <div className="p-4 bg-orange-100 rounded-xl border-2 border-orange-200 animate-in fade-in duration-300">
                            <label className="text-xs font-black text-orange-700 uppercase block mb-2">Configuración de tu Tienda</label>
                            <input
                                className="w-full border-2 border-white p-2.5 rounded-lg outline-orange-400 bg-white placeholder:text-gray-300"
                                type="text"
                                placeholder="Nombre comercial de la tienda"
                                required={formdata.role === UserRole.STORE}
                                //obligatorio solo si es tienda
                                onChange={(e) => setFormData({ ...formdata, storename: e.target.value })}
                            />
                            <p className="text-[10px] text-orange-600 mt-2 italic font-medium">
                                * Al registrarte, crearemos tu perfil de administrador de tienda automáticamente.
                            </p>
                        </div>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className={`bg-orange-500 text-white p-4 rounded-xl font-black text-lg shadow-lg shadow-orange-200 hover:bg-orange-600 active:scale-95 transition-all mt-2 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Creando cuenta...' : 'Finalizar Registro'}
                </button>
            </form>
        </div>
    );
}
