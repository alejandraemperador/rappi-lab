import { pool } from "../../config/database";
import { Order, AcceptOrderDTO, UpdateOrderStatusDTO } from "./orders.types";

// 1. Crear una nueva orden
export const createOrderService = async (data: any) => {
    const { consumerid, storeid, total, items } = data;

    const orderRes = await pool.query(
        'INSERT INTO orders (consumerid, storeid, total) VALUES ($1, $2, $3) RETURNING *',
        [consumerid, storeid, total]
    );
    const newOrder = orderRes.rows[0];

    // 2. Insertar los items
    if (items && items.length > 0) {
        for (const item of items) {
            await pool.query(
                'INSERT INTO order_items (orderid, productid, quantity, priceattime) VALUES ($1, $2, $3, $4)',
                [
                    newOrder.id,
                    item.productid || item.productId, 
                    item.quantity,
                    item.price || item.priceattime
                ]
            );
        }
    }
    return newOrder;
};

// 2. Obtener pedidos de un usuario específico
export const getUserOrdersService = async (data: { userid: string }): Promise<Order[]> => {
    const { userid } = data;
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
    const dbRequest = await pool.query(query, [userid]);
    return dbRequest.rows;
};

// 3. Obtener pedidos de una tienda
export const getStoreOrdersService = async (storeid: string): Promise<any[]> => {
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
    const result = await pool.query(query, [storeid]);
    return result.rows;
};

// 4. Pedidos disponibles para repartidores
export const getAvailableOrdersService = async (): Promise<any[]> => {
    const query = `
        SELECT 
            o.*, 
            s.name as store_name, 
            u.name as customer_name,
            (
                SELECT json_agg(
                    json_build_object(
                        'product_name', p.name,
                        'product_image', p.imageurl,
                        'product_price', oi.priceattime,
                        'quantity', oi.quantity
                    )
                )
                FROM order_items oi
                JOIN products p ON oi.productid = p.id
                WHERE oi.orderid = o.id
            ) as items
        FROM orders o
        JOIN stores s ON o.storeid = s.id
        JOIN users u ON o.consumerid = u.id
        WHERE o.status = 'pending' AND o.deliveryid IS NULL
        ORDER BY o.createdat DESC;
    `;
    const dbRequest = await pool.query(query);
    return dbRequest.rows;
};

// 5. Aceptar pedido
export const acceptOrderService = async (data: AcceptOrderDTO): Promise<Order> => {
    const { id, deliveryid } = data;
    const dbRequest = await pool.query(
        `UPDATE orders SET deliveryid = $2, status = 'accepted' WHERE id = $1 RETURNING *`,
        [id, deliveryid]
    );
    return dbRequest.rows[0];
};

// 6. Actualizar estado
export const updateOrderStatusService = async (data: UpdateOrderStatusDTO): Promise<Order> => {
    const { id, status } = data;
    const dbRequest = await pool.query(
        `UPDATE orders SET status = $2 WHERE id = $1 RETURNING *`,
        [id, status]
    );
    return dbRequest.rows[0];
};

// 7. Pedidos aceptados por un repartidor
export const getAcceptedOrdersService = async (deliveryid: string): Promise<any[]> => {
    const query = `
        SELECT 
            o.*, 
            s.name as store_name, 
            u.name as customer_name,
            (SELECT json_agg(json_build_object(
                'product_name', p.name,
                'product_image', p.imageurl,
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
    const dbRequest = await pool.query(query, [deliveryid]);
    return dbRequest.rows;
};