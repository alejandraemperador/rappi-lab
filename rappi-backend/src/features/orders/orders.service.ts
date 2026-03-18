import { pool } from "../../config/database";
import { CreateOrderDTO, Order, AcceptOrderDTO, UpdateOrderStatusDTO } from "./orders.types";

// Crear una nueva orden
// En src/features/orders/orders.service.ts
export const createOrderService = async (data: any) => { // Cambia temporalmente a any para probar
    const { consumerId, storeId, total, items } = data; // Usa CamelCase como en el frontend

    // 1. Crear la orden (Corregido INIO -> INTO y lolal -> total)
    const orderRes = await pool.query(
        'INSERT INTO orders (consumerid, storeid, total) VALUES ($1, $2, $3) RETURNING *',
        [consumerId, storeId, total]
    );
    const newOrder = orderRes.rows[0];

    // 2. Insertar los items
    if (items && items.length > 0) {
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (orderid, productid, quantity, priceattime) VALUES ($1, $2, $3, $4)',
                [newOrder.id, item.productId, item.quantity, item.price]
            );
        }
    }
    return newOrder;
};

// Obtener pedidos de un usuario específico (ESTE FALTABA)
export const getUserOrdersService = async (data: { userId: string }): Promise<Order[]> => {
    const { userId } = data;
    const query = `
        SELECT 
            o.*, 
            s.name as store_name,
            (SELECT json_agg(json_build_object(
                'name', p.name,
                'price', oi.priceattime,
                'quantity', oi.quantity,
                'image', p.imageurl
            ))
            FROM order_items oi
            JOIN products p ON oi.productid = p.id
            WHERE oi.orderid = o.id) as items
        FROM orders o
        JOIN stores s ON o.storeid = s.id
        WHERE o.consumerid = $1
        ORDER BY o.createdat DESC
    `;
    const dbRequest = await pool.query(query, [userId]);
    return dbRequest.rows;
};

// Obtener pedidos específicos de una tienda
export const getStoreOrdersService = async (storeId: string): Promise<any[]> => {
    const query = `
        SELECT 
            o.id, o.total, o.status, o.createdat,
            u.name as consumer_name,
            d.name as delivery_name,
            (SELECT json_agg(json_build_object(
                'name', p.name,
                'price', oi.priceattime,
                'quantity', oi.quantity,
                'imageurl', p.imageurl
            ))
            FROM order_items oi
            JOIN products p ON oi.productid = p.id
            WHERE oi.orderid = o.id) as items
        FROM orders o
        JOIN users u ON o.consumerid = u.id
        LEFT JOIN users d ON o.deliveryid = d.id
        WHERE o.storeid = $1
        ORDER BY o.createdat DESC
    `;
    const result = await pool.query(query, [storeId]);
    return result.rows;
};

export const getAvailableOrdersService = async (): Promise<Order[]> => {
    const query = `
        SELECT 
            o.*, 
            s.name as store_name, 
            u.name as customer_name
        FROM orders o
        JOIN stores s ON o.storeid = s.id
        JOIN users u ON o.consumerid = u.id
        WHERE o.status = 'pending' AND o.deliveryid IS NULL
        ORDER BY o.createdat DESC;
    `;
    const dbRequest = await pool.query(query);
    return dbRequest.rows;
};

export const acceptOrderService = async (data: AcceptOrderDTO): Promise<Order> => {
    const { id, deliveryid } = data;
    const dbRequest = await pool.query(
        `UPDATE orders SET deliveryid = $2, status = 'accepted' WHERE id = $1 RETURNING *`,
        [id, deliveryid]
    );
    return dbRequest.rows[0];
};

export const updateOrderStatusService = async (data: UpdateOrderStatusDTO): Promise<Order> => {
    const { id, status } = data;
    const dbRequest = await pool.query(
        `UPDATE orders SET status = $2 WHERE id = $1 RETURNING *`,
        [id, status]
    );
    return dbRequest.rows[0];
};

export const getAcceptedOrdersService = async (deliveryId: string): Promise<any[]> => {
    const query = `
        SELECT 
            o.*, 
            s.name as store_name, 
            u.name as customer_name,
            (SELECT json_agg(json_build_object(
                'product_name', p.name,
                'product_image', p.imageUrl,
                'product_price', oi.priceattime,
                'quantity', oi.quantity
            ))
            FROM order_items oi
            JOIN products p ON oi.productid = p.id
            WHERE oi.orderid = o.id) as items
        FROM orders o
        JOIN stores s ON o.storeid = s.id
        JOIN users u ON o.consumerid = u.id
        WHERE o.deliveryid = $1 AND o.status != 'delivered'
        ORDER BY o.createdat DESC;
    `;
    const dbRequest = await pool.query(query, [deliveryId]);
    return dbRequest.rows;
};