import { type RouteObject } from "react-router";
import Workshops from "@/pages/workshops/Workshops";
import WorkshopInstance from "@/pages/workshops/WorkshopInstance";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
    path: "workshops",
    loader: Spinner,
    children: [
        {
            index: true,
            Component: Workshops,
        },
        {
            path: ":id",
            Component: WorkshopInstance,
        },
    ],
};

export default routes;
