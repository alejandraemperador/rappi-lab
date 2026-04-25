export const OrderStatus = {
    CREATED: "Creado",
    IN_DELIVERY: "En entrega",
    DELIVERED: "Entregado",
} as const;

export type OrderStatus =
    (typeof OrderStatus)[keyof typeof OrderStatus];

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

    destination_lat?: number;
    destination_lng?: number;
    delivery_lat?: number;
    delivery_lng?: number;
}

export interface CreateOrderDTO {
    consumerid: string;
    storeid: string;
    total: number;

    items: {
        productid: string;
        quantity: number;
        priceattime: number;
    }[];

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
