import Boom from "@hapi/boom";
import { pool } from "../../config/database";
import { supabase } from "../../config/supabase";
import { Order, AcceptOrderDTO, UpdateOrderStatusDTO, OrderStatus, UpdateOrderPositionDTO, CreateOrderDTO } from "./orders.types";


//1. CONSUMER (CLIENTE)

// el consumer crear una nueva orden con su ubicacion
export const createOrderService = async (data: CreateOrderDTO): Promise<Order> => {
    const { consumerid, storeid, total, items, destination } = data;

    const orderRes = await pool.query(
        `INSERT INTO orders (consumerid, storeid, total, status, destination) 
        VALUES ($1, $2, $3, $4, ST_SetSRID(ST_MakePoint($5, $6), 4326)) 
        RETURNING id, consumerid, storeid, deliveryid, status, total, createdat,
        ST_Y(destination::geometry) AS destination_lat,
        ST_X(destination::geometry) AS destination_lng`,
        [consumerid, storeid, total, OrderStatus.CREATED, destination.longitude, destination.latitude]
    );
    const newOrder = orderRes.rows[0];

    // Guarda los productos de la orden
    if (items && items.length > 0) {
        for (const item of items) {
            await pool.query(
                `INSERT INTO order_items (orderid, productid, quantity, priceattime) 
                VALUES ($1, $2, $3, $4)`,
                [newOrder.id, item.productid, item.quantity, item.priceattime]
            );
        }
    }
    return {
        ...newOrder,
        destination: {
            latitude: Number(newOrder.destination_lat),
            longitude: Number(newOrder.destination_lng),
        },
    };
};

// Historial pedidos usuario
export const getUserOrdersService = async (userid: string): Promise<any[]> => {
    const dbRequest = await pool.query(
        `
        SELECT
            o.*,
            s.name AS store_name,
            u.name AS customer_name,

            ST_Y(o.destination::geometry) AS destination_lat,
            ST_X(o.destination::geometry) AS destination_lng,

            ST_Y(o.delivery_position::geometry) AS delivery_lat,
            ST_X(o.delivery_position::geometry) AS delivery_lng,

            (
                SELECT json_agg(
                    json_build_object(
                        'name', p.name,
                        'price', oi.priceattime,
                        'quantity', oi.quantity,
                        'image', p.imageurl
                    )
                )
                FROM order_items oi
                JOIN products p ON oi.productid = p.id
                WHERE oi.orderid = o.id
            ) AS items

        FROM orders o
        JOIN stores s ON o.storeid = s.id
        JOIN users u ON o.consumerid = u.id

        WHERE o.consumerid = $1
        OR o.deliveryid = $1

        ORDER BY o.createdat DESC
        `,
        [userid]
    );

    return dbRequest.rows;
};

// 2. STORE (TIENDA)

// Trae pedidos que el consumer hizo a una tienda
export const getStoreOrdersService = async (storeid: string): Promise<any[]> => {
    const dbRequest = await pool.query(
        `
        SELECT
            o.id,
            o.total,
            o.status,
            o.createdat,

            u.name AS consumer_name,
            d.name AS delivery_name,

        (
            SELECT json_agg(
            json_build_object(
                'name', p.name,
                'price', oi.priceattime,
                'quantity', oi.quantity,
                'imageurl', p.imageurl
            )
        )
        FROM order_items oi
        JOIN products p ON oi.productid = p.id
        WHERE oi.orderid = o.id
        ) AS items

        FROM orders o
        JOIN users u ON o.consumerid = u.id
        LEFT JOIN users d ON o.deliveryid = d.id
        WHERE o.storeid = $1
        ORDER BY o.createdat DESC
        `,
        [storeid]
    );

    return dbRequest.rows;
};

// 3. DELIVERY

//  Pedidos disponibles para repartidores
export const getAvailableOrdersService = async (): Promise<any[]> => {
    const dbRequest = await pool.query(
        `
        SELECT
        o.*,
        s.name AS store_name,
        u.name AS customer_name,

        ST_Y(o.destination::geometry) AS destination_lat,
        ST_X(o.destination::geometry) AS destination_lng,

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
        ) AS items

        FROM orders o
        JOIN stores s ON o.storeid = s.id

        JOIN users u ON o.consumerid = u.id

        WHERE o.status = $1
        AND o.deliveryid IS NULL
        ORDER BY o.createdat DESC
        `,
        [OrderStatus.CREATED]
    );

    return dbRequest.rows;
};

// El delivery acepta pedido (Cambia a 'En entrega')
export const acceptOrderService = async (data: AcceptOrderDTO): Promise<Order> => {
    const { id, deliveryid } = data;
    const dbRequest = await pool.query(
        `
        UPDATE orders
        SET deliveryid = $2,
            status = $3
        WHERE id = $1
        AND deliveryid IS NULL
        RETURNING *
        `,
        [id, deliveryid, OrderStatus.IN_DELIVERY]
    );

    return dbRequest.rows[0];
};

// Actualizar posición del repartidor y detectar llegada (< 5 metros)
export const updateOrderPositionService = async (id: string, data: UpdateOrderPositionDTO) => {
    const { latitude, longitude } = data;
    //Actualizar posición
    const dbRequest = await pool.query(
        `
        UPDATE orders
        SET delivery_position =
        ST_SetSRID(ST_MakePoint($2, $1), 4326),

        status = CASE
            WHEN ST_DWithin(
            ST_SetSRID(ST_MakePoint($2, $1), 4326),
            destination::geography,
            20
            )
            THEN $4
            ELSE status
        END

        WHERE id = $3

        RETURNING
        id,
        status,
        ST_Y(delivery_position::geometry) AS latitude,
        ST_X(delivery_position::geometry) AS longitude
        `,
        [latitude, longitude, id, OrderStatus.DELIVERED]
    );

    const updatedOrder = dbRequest.rows[0];

    if (!dbRequest.rows[0]) {
        throw Boom.notFound("Pedido no encontrado");
    }

    // Broadcast realtime
    const channel = supabase.channel(`order_tracking_${id}`);

    await channel.send({
        type: "broadcast",
        event: "position-update",
        payload: {
            latitude: updatedOrder.latitude,
            longitude: updatedOrder.longitude,
            status: updatedOrder.status,
        },
    });

    return updatedOrder;
};

// Actualizar estado del pedido
export const updateOrderStatusService = async (data: UpdateOrderStatusDTO): Promise<Order> => {
    const { id, status } = data;
    const dbRequest = await pool.query(
        `
        UPDATE orders
        SET status = $2
        WHERE id = $1
        RETURNING *
        `,
        [id, status]
    );

    return dbRequest.rows[0];
};

// Pedidos aceptados por un repartidor
export const getAcceptedOrdersService = async (deliveryid: string): Promise<any[]> => {
    const dbRequest = await pool.query(
        `
        SELECT
        o.*,
        s.name AS store_name,
        u.name AS customer_name,

        ST_Y(o.destination::geometry) AS destination_lat,
        ST_X(o.destination::geometry) AS destination_lng,

        ST_Y(o.delivery_position::geometry) AS delivery_lat,
        ST_X(o.delivery_position::geometry) AS delivery_lng,

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
        ) AS items

        FROM orders o
        JOIN stores s ON o.storeid = s.id

        JOIN users u ON o.consumerid = u.id
        
        WHERE o.deliveryid = $1
        AND o.status != $2
        ORDER BY o.createdat DESC
        `,
        [deliveryid, OrderStatus.DELIVERED]
    );

    return dbRequest.rows;
};

