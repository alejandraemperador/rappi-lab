import axios from "axios";
import type { Order, CreateOrderDTO } from "../types/orders.types";
import type { Store } from "../types/stores.types";
import type { Product } from "../types/products.types";

const API_URL = "https://rappi-lab-backend-nine.vercel.app/api";

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
};

// 1. Obtener todas las tiendas (Para el ConsumerLanding)
export const getStores = async (): Promise<Store[]> => {
    const response = await axios.get(`${API_URL}/stores`, getAuthHeaders());
    return response.data;
};

// 2. Obtener productos de una tienda (Para StoreDetail y StoreLanding)
export const getProductsByStore = async (storeId: string): Promise<Product[]> => {
    const response = await axios.get(`${API_URL}/products/stores/${storeId}`, getAuthHeaders());
    return response.data;
};

// 3. Crear una nueva orden (Para el carrito/StoreDetail)
export const createOrder = async (order: CreateOrderDTO): Promise<Order> => {
    const response = await axios.post(`${API_URL}/orders`, order, getAuthHeaders());
    return response.data;
};

// 4. Obtener órdenes de un USUARIO (Para la página Mis Pedidos / Orders.tsx)
export const getUserOrders = async (userId: string): Promise<Order[]> => {
    const response = await axios.get(`${API_URL}/orders/user/${userId}`, getAuthHeaders());
    return response.data;
};

// 5. Obtener órdenes de una TIENDA (Para el Dashboard del dueño / StoreOrders.tsx)
export const getStoreOrders = async (storeId: string): Promise<any> => {
    const response = await axios.get(`${API_URL}/orders/store/${storeId}`, getAuthHeaders());
    return response.data;
};
