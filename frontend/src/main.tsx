import { createRoot } from "react-dom/client"
import { createBrowserRouter, RouterProvider } from "react-router"
import routes from "@/routes";
import "@/index.css"
import AuthProvider from "@/components/context/AuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar";

const router = createBrowserRouter([routes]);

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <SidebarProvider defaultOpen={false}>
      <RouterProvider router={router} />
    </SidebarProvider>
  </AuthProvider>
)
