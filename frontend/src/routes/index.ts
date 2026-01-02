import App from "@/App";
import type { RouteObject } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import authRoutes from "@/routes/authRoutes";
import homeRoutes from "@/routes/homeRoutes";
import workshopRoutes from "@/routes/workshopRoutes"
import exhibitionRoutes from "@/routes/exhibitionRoutes"
import shopRoutes from "@/routes/shopRoutes"
import productRoutes from "@/routes/productRoutes"
import sellerProductsRoutes from "@/routes/sellerProductsRoutes"
import roleChoose from "@/routes/roleChoose"
import profileRoutes from "./profileRoutes";
import organizerProfileRoutes from "./organizerProfileRoutes"
import reservationsRoutes from "@/routes/reservationsRoutes";
import organizedEventsRoutes from "@/routes/organizedEventsRoutes";
import createEventRoutes from "@/routes/createEventRoutes";
import forumRoutes from "@/routes/forumRoutes"
import adminRoutes from "@/routes/adminRoutes"

const routes: RouteObject = {
  path: "/",
  Component: App,
  children: [
    homeRoutes,
    authRoutes,
    workshopRoutes,
    exhibitionRoutes,
    shopRoutes,
    productRoutes,
    sellerProductsRoutes,
    reservationsRoutes,
    roleChoose,
    profileRoutes,
    organizerProfileRoutes,
    organizedEventsRoutes,
    createEventRoutes,
    forumRoutes,
    adminRoutes,
  ],
  errorElement: ErrorPage({ code: 404, message: "Page Not Found" }),
};

export default routes;
