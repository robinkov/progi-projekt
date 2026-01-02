import { type RouteObject } from "react-router";
import Forum from "@/pages/forum/Forum";
import ForumPage from "@/pages/forum/ForumPage";
import { Spinner } from "@/components/ui/spinner";
import HomeLayout from "@/pages/app/_Layout";

const routes: RouteObject = {
    path: "forum",
    Component: HomeLayout,
    children: [
        {
            index: true,
            loader: Spinner,
            Component: Forum,
        },
        {
            path: ":id",
            loader: Spinner,
            Component: ForumPage,
        },
    ],
};

export default routes;
