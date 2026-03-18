export interface OrderItem {
    id: string;
    orderid: string;
    productid: string;
    quantity: number;
    priceAtTime: number;
}

export interface CreateOrderItemDTO {
    orderid: string;
    productid: string;
    quantity: number;
    priceAtTime: number;
}