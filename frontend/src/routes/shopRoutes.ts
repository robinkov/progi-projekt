import { type RouteObject } from "react-router";
import Shop from "@/pages/shop/Shop";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
    path: "shop",
    loader: Spinner,
    Component: Shop,
};

export default routes;