import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar } from "@/components/ui/sidebar";
import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import navbarData from "@/constants/navbarData";
import { useEffect } from "react";

export default function NavSidebar() {
  const { toggleSidebar } = useSidebar();

  useEffect(() => {
     
  }, []);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarGroupLabel className="justify-between py-4 pt-6">
          <h1 className="text-xl">Menu</h1>
          <Button variant="ghost" onClick={toggleSidebar} className="rounded-full">
            <X className="size-5" />
          </Button>
        </SidebarGroupLabel>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              { navbarData.content.map(({ text, path }, idx) => (
                <SidebarMenuItem key={`navitem-${idx}`}>
                  <SidebarMenuButton asChild>
                    <Link to={ path }>{ text }</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )) }
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenu>
            { navbarData.footer.map(({ text, path }, idx) => (
                <SidebarMenuItem key={`navitem-${idx}`}>
                  <SidebarMenuButton asChild>
                    <Link to={ path }>{ text }</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )) }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>
  );
}
