import Boom from "@hapi/boom";
import { pool } from "../../config/database";
import { CreateStoreDTO, Store, UpdateStoreStatusDTO } from "./stores.types";

// Obtener todas las tiendas abiertas (Para el consumidor)
export const getStoresService = async (): Promise<Store[]> => {
    const query = 'SELECT * FROM stores WHERE isopen = true';
    const dbRequest = await pool.query(query);
    return dbRequest.rows;
}

// NUEVO: Obtener la tienda de un dueño específico (Para el admin de la tienda)
export const getStoreByUserIdService = async (userId: string): Promise<Store | null> => {
    const dbRequest = await pool.query(
        'SELECT * FROM stores WHERE userid = $1',
        [userId]
    );
    return dbRequest.rows[0] || null;
}

// Crear una tienda
export const createStoreService = async (data: CreateStoreDTO): Promise<Store> => {
    const { name, userId } = data;
    const userCheck = await pool.query('SELECT role FROM users WHERE id = $1', [userId]);

    if (userCheck.rows.length === 0) throw Boom.notFound("The user doesnt exist");
    
    const userRole = userCheck.rows[0].role;
    if (userRole !== 'store') throw Boom.forbidden("Only users with role 'store' can create it");

    const dbRequest = await pool.query(
        `INSERT INTO stores (name, userId) VALUES ($1, $2) RETURNING *`,
        [name, userId]
    );
    return dbRequest.rows[0];
}

// Actualizar estado (Abierto/Cerrado)
export const updateStoreStatusService = async (data: UpdateStoreStatusDTO): Promise<Store> => {
    const { id, isopen } = data;
    const dbRequest = await pool.query(
        "UPDATE stores SET isopen = $1 WHERE id = $2 RETURNING *",
        [isopen, id]
    );
    return dbRequest.rows[0];
}

export const deleteProductService = async (productId: string) => {
    // 1. Verificar si el producto tiene pedidos asociados
    const orderCheck = await pool.query(
        'SELECT 1 FROM order_items WHERE productid = $1 LIMIT 1',
        [productId]
    );

    if (orderCheck.rows.length > 0) {
        throw Boom.conflict("No puedes eliminar un producto que ya ha sido pedido por clientes.");
    }

    // 2. Si no tiene pedidos, borrar
    const result = await pool.query('DELETE FROM products WHERE id = $1 RETURNING *', [productId]);
    return result.rows[0];
};