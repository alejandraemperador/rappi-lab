import { Router } from 'express';
import { createProductController, deleteProductController, getProductsByStoreController } from './products.controller';

export const router = Router ();

router.get ('/stores/:storeid', getProductsByStoreController);
router.post ('/', createProductController);
router.delete ('/:id', deleteProductController);