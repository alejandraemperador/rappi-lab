import { pool } from "../../../config/database";
import { CreateOrderItemDTO, OrderItem } from "./orderItems.types";

// Crear item
export const createOrderItemService = async (data: CreateOrderItemDTO): Promise<OrderItem> => {
    const { orderid, productid, quantity, priceattime } = data;
    const dbRequest = await pool.query(
        `
        INSERT INTO order_items (
        orderid,
        productid,
        quantity,
        priceattime
        )
        VALUES ($1,$2,$3,$4)
        RETURNING *
        `,
        [orderid, productid, quantity, priceattime]
    );

    return dbRequest.rows[0];
};

// Detalles del pedido
export const getOrderDetailsService = async (orderid: string) => {
    const result = await pool.query(
    `
        SELECT
        oi.id,
        oi.orderid,
        oi.productid,
        oi.quantity,
        oi.priceattime,

        p.name,
        p.imageurl

        FROM order_items oi
        JOIN products p
        ON oi.productid = p.id

        WHERE oi.orderid = $1
        `,
        [orderid]
    );

    return result.rows;
};