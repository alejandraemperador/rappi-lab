import { Request, Response, NextFunction } from "express";
import {
    createOrderService,
    getAvailableOrdersService,
    acceptOrderService,
    updateOrderStatusService,
    getUserOrdersService,
    getStoreOrdersService,
    getAcceptedOrdersService
} from "./orders.service";

import {
    createOrderItemService,
    getOrderDetailsService
} from "./orderItems/orderItems.service";
import Boom from "@hapi/boom";

// Crear una nueva orden con sus respectivos items
export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { consumerid, storeid, total, items } = req.body;
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw Boom.badRequest("La orden debe contener al menos un producto (items)");
        }

        // CAMBIO AQUÍ: Pasa las llaves que el SERVICIO espera (consumerId, storeId)
        const order = await createOrderService({ 
            consumerid: consumerid, 
            storeid: storeid, 
            total 
        });

        // 2. Creamos los detalles (items)
        await Promise.all(items.map(item => 
            createOrderItemService({
                orderid: order.id,
                productid: item.productId,
                quantity: item.quantity,
                priceattime: item.price
            })
        ));

        return res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

// Obtener pedidos de una tienda específica
export const getStoreOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { storeid } = req.params;
        const orders = await getStoreOrdersService(String(storeid));
        return res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Ver órdenes pendientes para repartidores
export const getAvailableOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await getAvailableOrdersService();
        return res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Aceptar una orden (repartidor)
export const acceptOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { deliveryid } = req.body;
        
        if (!deliveryid) throw Boom.badRequest("Se requiere el ID del repartidor");

        const order = await acceptOrderService({ id: String(id), deliveryid });
        return res.json(order);
    } catch (error) {
        next(error);
    }
};

// Actualizar estado de la orden
export const updateOrderStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        
        if (!status) throw Boom.badRequest("El nuevo estado es requerido");

        const order = await updateOrderStatusService({ id: String(id), status });
        return res.json(order);
    } catch (error) {
        next(error);
    }
};

// Obtener historial de órdenes de un usuario
export const getUserOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userid } = req.params;
        const orders = await getUserOrdersService({ userid: String(userid) });
        return res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Ver detalles de una orden específica
export const getOrderDetailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const details = await getOrderDetailsService(String(id));
        return res.json(details);
    } catch (error) {
        next(error);
    }
};

export const getAcceptedOrdersController = async (req: Request, res: Response) => {
    const { deliveryid } = req.params;
    const data = await getAcceptedOrdersService(String(deliveryid));
    res.json(data);
};