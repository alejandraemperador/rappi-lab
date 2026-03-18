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
router.get("/store/:storeid", getStoreOrdersController); // La nueva
router.patch("/:id/accept", acceptOrderController);
router.patch("/:id/status", updateOrderStatusController);
router.get("/user/:userid", getUserOrdersController);
router.get("/:id/details", getOrderDetailsController);
router.get("/delivery/:deliveryid", getAcceptedOrdersController);