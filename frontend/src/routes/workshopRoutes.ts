import { type RouteObject } from "react-router";
import Workshops from "@/pages/workshops/Workshops";
import WorkshopInstance from "@/pages/workshops/WorkshopInstance";
import { Spinner } from "@/components/ui/spinner";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
    path: "workshops",
    loader: Spinner,
    Component: HomeLayout,
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
