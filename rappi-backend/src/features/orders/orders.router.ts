import { Router } from "express";
import {
    createOrderController,
    getUserOrdersController,
    getOrderDetailsController,

    getStoreOrdersController,

    getAvailableOrdersController,
    getAcceptedOrdersController,

    acceptOrderController,
    updateOrderPositionController,
    updateOrderStatusController,
} from "./orders.controller";

export const router = Router();

// Consumer
router.post("/", createOrderController);
router.get("/user/:userid", getUserOrdersController);
router.get("/:id/details", getOrderDetailsController);

// Store
router.get("/store/:storeid", getStoreOrdersController);

// Delivery
router.get("/available", getAvailableOrdersController);
router.get("/delivery/:deliveryid", getAcceptedOrdersController);

router.patch("/:id/accept", acceptOrderController);
router.patch("/:id/position", updateOrderPositionController);
router.patch("/:id/status", updateOrderStatusController);