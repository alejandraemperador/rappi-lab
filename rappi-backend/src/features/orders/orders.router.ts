import { Router } from "express";
import {
    createOrderController,
    getAvailableOrdersController,
    acceptOrderController,
    updateOrderStatusController,
    getUserOrdersController,
    getOrderDetailsController,
    getStoreOrdersController,
    getAcceptedOrdersController
} from "./orders.controller";

export const router = Router();

router.post("/", createOrderController);
router.get("/available", getAvailableOrdersController);
router.get("/store/:storeId", getStoreOrdersController); // La nueva
router.patch("/:id/accept", acceptOrderController);
router.patch("/:id/status", updateOrderStatusController);
router.get("/user/:userId", getUserOrdersController);
router.get("/:id/details", getOrderDetailsController);
router.get("/delivery/:deliveryId", getAcceptedOrdersController);