import { pool } from "../../../config/database";
import { CreateOrderItemDTO } from "./orderItems.types";


export const createOrderItemService = async (data: CreateOrderItemDTO) => {

    const { orderid, productid, quantity, priceAtTime } = data;
    await pool.query(
    `INSERT INTO order_items (orderId, productId, quantity, priceAtTime)
    VALUES ($1,$2,$3,$4)`,
        [orderid, productid, quantity, priceAtTime]
    );

};


export const getOrderDetailsService = async (orderid: string) => {

    const dbRequest = await pool.query(
    `SELECT oi.*, p.name
    FROM order_items oi
    JOIN products p ON oi.productid = p.id
    WHERE oi.orderid = $1`,
    [orderid]
    );
    return dbRequest.rows;
};