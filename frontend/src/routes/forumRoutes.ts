import { type RouteObject } from "react-router";
import Forum from "@/pages/forum/Forum";
import ForumPage from "@/pages/forum/ForumPage";
import { Spinner } from "@/components/ui/spinner";

const routes: RouteObject = {
    path: "forum",
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
