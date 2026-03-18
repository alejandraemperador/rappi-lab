import axios from 'axios';

const API_URL = 'https://rappi-lab-backend-nine.vercel.app/api/orders';

// Obtener pedidos en el "radar" (disponibles)
export const getAvailableOrders = async () => {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/available`, {
        headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
};

// Aceptar un pedido
export const acceptOrder = async (orderid: string, deliveryid: string) => {
    const response = await axios.patch(`${API_URL}/${orderid}/accept`, {
        deliveryid: deliveryid
    });
    return response.data;
};

export const getAcceptedOrders = async (deliveryid: string) => {
    const response = await axios.get(`${API_URL}/delivery/${deliveryid}`);
    return response.data;
};
// Finalizar la entrega
export const updateOrderStatus = async (orderid: string, status: string) => {
    const response = await axios.patch(`${API_URL}/${orderid}/status`, {
        status: status
    });
    return response.data;
};
