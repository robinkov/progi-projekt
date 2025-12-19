import App from "@/App";
import type { RouteObject } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import authRoutes from "@/routes/authRoutes";
import homeRoutes from "@/routes/homeRoutes";
import workshopRoutes from "@/routes/workshopRoutes"
import exhibitionRoutes from "@/routes/exhibitionRoutes"
import shopRoutes from "@/routes/shopRoutes"
import roleChoose from "@/routes/roleChoose"
import profileRoutes from "./profileRoutes";
import organizerProfileRoutes from "./organizerProfileRoutes"

const routes: RouteObject = {
  path: "/",
  Component: App,
  children: [
    homeRoutes,
    authRoutes,
    workshopRoutes,
    exhibitionRoutes,
    shopRoutes,
    roleChoose,
    profileRoutes,
    organizerProfileRoutes,
  ],
  errorElement: ErrorPage({ code: 404, message: "Page Not Found" }),
};

export default routes;
