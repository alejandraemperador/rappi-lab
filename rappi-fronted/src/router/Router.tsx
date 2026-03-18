import { createBrowserRouter } from "react-router-dom";
import LoginPage from '../pages/auth/login/LoginPage';
import RegisterPage from "../pages/auth/register/RegisterPage";
import ConsumerLanding from "../pages/consumer/ConsumerLanding";
import StoreDetail from "../pages/consumer/StoreDetail";
import Orders from "../pages/consumer/Orders";
import StoreLanding from "../pages/store/StoreLanding";
import StoreOrders from "../pages/store/StoreOrders";
import DeliveryLanding from "../pages/delivery/DeliveryLanding";
import AcceptedOrders from "../pages/delivery/AcceptedOrders";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage/>,
    },
    {
        path: "/login",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    // RUTAS DE CONSUMER
    {
        path: "/consumer",
        element: <ConsumerLanding/>,
    },
    {
        path: '/store/:id',
        element: <StoreDetail />,
    },
    {
        path: '/orders',
        element: <Orders />,
    },
    // RUTAS DE STORE
    {
        path: "/store-landing",
        element: <StoreLanding />,
    },
    {
        path: "/store-orders",
        element: <StoreOrders />,
    },
    // RUTAS DE DELIVERY
    {
        path: "/delivery-landing",
        element: <DeliveryLanding />,
    },
    {
        path: "/delivery-accepted",
        element: <AcceptedOrders />,
    },
]);
