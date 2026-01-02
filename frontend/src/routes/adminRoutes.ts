import { type RouteObject } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import ProfileApproval from "@/pages/admin/ProfileApproval";
import HomeLayout from "@/pages/app/_Layout";

const profileRoutes: RouteObject = {
    path: "admin",
    loader: Spinner,
    Component: HomeLayout,
    children: [
        {
            path: "pending",
            Component: ProfileApproval
        }
    ]
};

export default profileRoutes;