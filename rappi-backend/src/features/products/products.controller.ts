import { Request, Response } from "express";
import { createProductService, deleteProductService, getProductsByStoreService } from "./products.service";
import  Boom  from "@hapi/boom";

// Obtener productos por tienda
export const getProductsByStoreController = async (req: Request, res: Response) => {
    const {storeid} = req.params;
    const products = await getProductsByStoreService (String(storeid));

    return res.json (products);
};

// Crear producto
export const createProductController = async (req: Request, res: Response) => {
    const {name, description, price, imageurl, storeid} = req.body;
    if (!name || !price || !storeid) {
        throw Boom.badRequest ('name, price and storeid are required');
    }
    const product = await createProductService ({
        name,
        description,
        price,
        imageurl,
        storeid
    });
    return res.json (product)
};

// eliminar producto
export const deleteProductController = async (req: Request, res: Response) => {
    const {id} = req.params
    const product = await deleteProductService (String (id));
    return res.json (product);
};