export enum OrderStatus {
    CREATED = "Creado",
    IN_DELIVERY = "En entrega",
    DELIVERED = "Entregado",
}

export interface Lating {
    latitude: number;
    longitude: number;
}

export interface Order {
    id: string;
    consumerid: string;
    storeid: string;
    deliveryid: string | null;
    status: OrderStatus;
    total: number;
    createdat: string;

    destination?: Lating;
    delivery_position?: Lating | null;
}

export interface CreateOrderDTO {
    consumerid: string;
    storeid: string;
    total: number;
    items?: {
        productid: string;
        quantity: number;
        priceattime: number;
    } [];
    destination: Lating;
}

export interface AcceptOrderDTO {
    id: string;
    deliveryid: string;
}

export interface UpdateOrderStatusDTO {
    id: string;
    status: OrderStatus;
}

export interface UpdateOrderPositionDTO {
    latitude: number;
    longitude: number;
}

