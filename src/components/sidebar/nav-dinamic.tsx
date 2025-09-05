"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SIDEBAR } from "@/lib/data-nav";

export function DynamicNav() {
  const pathname = usePathname();
  return (
    <>
      {SIDEBAR.navMain.map((group) => (
        <SidebarGroup
          key={group.title}
          className="group-data-[collapsible=icon]:hidden"
        >
          <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
          <SidebarMenu>
            {group.items.map((item) => {
              const isActive = pathname === item.url;
              return (
                <SidebarMenuItem key={item.name}>
                  <SidebarMenuButton
                    asChild
                    className={
                      isActive ? "bg-muted text-foreground" : "hover:bg-accent"
                    }
                  >
                    <Link href={item.url}>
                      <item.icon
                        className={
                          isActive ? "text-foreground" : "text-muted-foreground"
                        }
                      />
                      <span>{item.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </>
  );
}
