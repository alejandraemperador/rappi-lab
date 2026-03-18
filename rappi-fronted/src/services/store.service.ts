import axios from "axios";
const API_URL = "https://rappi-lab-backend-nine.vercel.app/api";

const getAuthHeaders = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
});

export const getMyStore = async (userId: string) => {
    const response = await axios.get(`${API_URL}/stores/user/${userId}`, getAuthHeaders());
    return response.data;
};

export const toggleStoreStatus = async (storeId: string, isOpen: boolean) => {
    const response = await axios.patch(`${API_URL}/stores/${storeId}/status`, { isopen: isOpen }, getAuthHeaders());
    return response.data;
};

export const createProduct = async (productData: any) => {
    const dataToSend = {
        name: productData.name,
        description: productData.description,
        price: Number(productData.price),
        imageUrl: productData.imageUrl,
        storeId: productData.storeId
    };
    const response = await axios.post(`${API_URL}/products`, dataToSend, getAuthHeaders());
    return response.data;
};

export const deleteProduct = async (productId: string) => {
    const response = await axios.delete(`${API_URL}/products/${productId}`, getAuthHeaders());
    return response.data;
};
