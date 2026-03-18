import axios from 'axios';

const API_URL = 'https://rappi-lab-backend-nine.vercel.app/api/orders';

// Obtener pedidos en el "radar" (disponibles)
export const getAvailableOrders = async () => {
    const response = await axios.get(`${API_URL}/available`);
    return response.data;
};

// Aceptar un pedido
export const acceptOrder = async (orderId: string, deliveryId: string) => {
    const response = await axios.patch(`${API_URL}/${orderId}/accept`, {
        deliveryid: deliveryId
    });
    return response.data;
};

export const getAcceptedOrders = async (deliveryId: string) => {
    const response = await axios.get(`${API_URL}/delivery/${deliveryId}`);
    return response.data;
};
// Finalizar la entrega
export const updateOrderStatus = async (orderId: string, status: string) => {
    const response = await axios.patch(`${API_URL}/${orderId}/status`, {
        status: status
    });
    return response.data;
};
