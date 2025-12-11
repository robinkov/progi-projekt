import App from "@/App";
import type { RouteObject } from "react-router";
import ErrorPage from "@/pages/ErrorPage";
import authRoutes from "@/routes/authRoutes";
import homeRoutes from "@/routes/homeRoutes";

const routes: RouteObject = {
  path: "/",
  Component: App,
  children: [
    homeRoutes,
    authRoutes,
  ],
  errorElement: ErrorPage({ code: 404, message: "Page Not Found" }),
};

export default routes;
