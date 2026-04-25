import { Request, Response, NextFunction } from "express";
import {
    createOrderService, // Crear una orden
    getAvailableOrdersService,// Obteniene órdenes disponibles (para repartidores)
    acceptOrderService, // Aceptar una orden
    updateOrderStatusService, // Actualizar estado de la orden
    getUserOrdersService, // Órdenes de un usuario
    getStoreOrdersService, // Órdenes de una tienda
    getAcceptedOrdersService, // Órdenes aceptadas por repartidor
    updateOrderPositionService
} from "./orders.service";

import {
    getOrderDetailsService
} from "./orderItems/orderItems.service";
import Boom from "@hapi/boom";


// 1. CONTROLLERS DE CONSUMER

// El consumer crear una orden
export const createOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { consumerid, storeid, total, items, destination } = req.body;
        if (!items || !Array.isArray(items) || items.length === 0) {
            throw Boom.badRequest("La orden debe contener al menos un producto");
        }
        // Valida el destino
        if (
        !destination ||
        typeof destination.latitude !== "number" ||
        typeof destination.longitude !== "number"
        ) {
        throw Boom.badRequest(
            "Debe enviar su ubicación con la latitud y la longitud"
        );
        }
        // Llama al servicio para crear la orden en la BD
        const order = await createOrderService({
            consumerid,
            storeid,
            total,
            items,
            destination,
            });

        return res.status(201).json(order);
    } catch (error) {
        next(error);
    }
};

// El consumer puede ver que pidio en su historial de pedidos (mis pedidos)
export const getUserOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userid } = req.params;
        const orders = await getUserOrdersService(String(userid));
        return res.json(orders);
    } catch (error) {
        next(error);
    }
};

// el consume puede ver los detalles de una orden específica
export const getOrderDetailsController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        // Obtiene los detalles (productos, etc.)
        const details = await getOrderDetailsService(String(id));
        return res.json(details);
    } catch (error) {
        next(error);
    }
};


// 2. CONTROLLERS DE STORE (tienda)

// Ver pedidos de una tienda específica
export const getStoreOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { storeid } = req.params;
        // Llama al servicio para traer las órdenes de esa tienda
        const orders = await getStoreOrdersService(String(storeid));

        return res.json(orders);
    } catch (error) {
        next(error);
    }
};

// 3. CONTROLLERS DE DELIVERY (repartidor)
//El repartidor trabaja con pedidos (los toma y los gestiona)

// Ver pedidos disponibles
export const getAvailableOrdersController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orders = await getAvailableOrdersService();
        return res.json(orders);
    } catch (error) {
        next(error);
    }
};

// Aceptar una pedido (delivery)
export const acceptOrderController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { deliveryid } = req.body;

        if (!deliveryid) throw Boom.badRequest("Se requiere el ID del repartidor");

        // Llama al servicio para asignar la orden al repartidor
        const order = await acceptOrderService({ id: String(id), deliveryid });
        return res.json(order);
    } catch (error) {
        next(error);
    }
};

// Pedidos aceptados por el repartidor
export const getAcceptedOrdersController = async (req: Request, res: Response) => {
    // ID del repartidor
    const { deliveryid } = req.params;
    // Busca órdenes que ya aceptó
    const data = await getAcceptedOrdersService(String(deliveryid));
    res.json(data);
};

// Actualizar estado del pedido 
export const updateOrderStatusController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) throw Boom.badRequest("El nuevo estado es requerido");

        // Actualiza el estado en la BD
        const order = await updateOrderStatusService({ id: String(id), status });
        return res.json(order);
    } catch (error) {
        next(error);
    }
};

// Actualizar la posición repartidor
export const updateOrderPositionController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { latitude, longitude } = req.body;

        if (
        typeof latitude !== "number" ||
        typeof longitude !== "number"
        ) {
        throw Boom.badRequest(
            "latitude y longitude deben ser números"
        );
        }

        const order = await updateOrderPositionService(
        String(id),
        {
            latitude,
            longitude,
        }
        );

        return res.json(order);
    } catch (error) {
        next(error);
    }
};