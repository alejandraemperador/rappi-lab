import { Router } from "express";
import { 
    createStoreController, 
    getStoresController, 
    updateStoreStatusController,
    getStoreByUserIdController // <-- Importamos el nuevo controlador
} from "./stores.controller";

export const router = Router();

// Obtener todas las tiendas
router.get('/', getStoresController);

// NUEVO: Obtener la tienda de un usuario (Dueño)
router.get('/user/:userId', getStoreByUserIdController);

// Crear tienda
router.post('/', createStoreController);

// Actualizar estado (Abrir/Cerrar)
router.patch('/:id/status', updateStoreStatusController);