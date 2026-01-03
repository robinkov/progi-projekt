import { type RouteObject } from "react-router";
import { Spinner } from "@/components/ui/spinner";
import ProfileApproval from "@/pages/admin/ProfileApproval";
import HomeLayout from "@/pages/app/_Layout";
import OrganizerPreview from "@/pages/admin/OrganizerPreview";

const profileRoutes: RouteObject = {
    path: "admin",
    loader: Spinner,
    Component: HomeLayout,
    children: [
        {
            path: "pending",
            Component: ProfileApproval
        },
        {
            path: "organizer-preview/:id",
            Component: OrganizerPreview
        }
    ]
};

export default profileRoutes;