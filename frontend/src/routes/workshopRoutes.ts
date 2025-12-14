import { type RouteObject } from "react-router";
import Workshops from "@/pages/workshops/Workshops";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
    path: "workshops",
    loader: Spinner,
    Component: Workshops,
};

export default routes;