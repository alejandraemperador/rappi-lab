import { Request, Response } from "express";
import { createStoreService, getStoreByUserIdService, getStoresService, updateStoreStatusService } from './stores.service';
import Boom from "@hapi/boom";

export const getStoresController = async (req: Request, res: Response) => {
    const stores = await getStoresService();
    return res.json(stores);
}
export const getStoreByUserIdController = async (req: Request, res: Response) => {
    const { userId } = req.params;
    const store = await getStoreByUserIdService(String(userId));
    
    if (!store) {
        throw Boom.notFound("Este usuario no tiene una tienda asignada");
    }
    return res.json(store);
}

export const createStoreController = async (req: Request, res: Response) => {
    const { name, userId } = req.body;
    
    if (!name || !userId) {
        throw Boom.badRequest("name and userId are required");
    }
    const store = await createStoreService({ name, userId })
    return res.json(store);
}

export const updateStoreStatusController = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { isopen } = req.body;

    if (isopen === undefined) {
        throw Boom.badRequest('isopen field is required');
    }

    const updateStore = await updateStoreStatusService({ id: String(id), isopen });
    return res.json(updateStore);
};
