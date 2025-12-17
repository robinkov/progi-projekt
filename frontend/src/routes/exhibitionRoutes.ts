import { type RouteObject } from "react-router";
import Exhibitions from "@/pages/exhibitions/Exhibitions";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
    path: "exhibitions",
    loader: Spinner,
    Component: Exhibitions,
};

export default routes;