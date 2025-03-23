"use client"

import * as React from "react"
import {
    BookOpen,
    File,
    FilePlus,
    Folder,
    Telescope
} from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    SidebarTrigger,
    useSidebar,
} from "@/components/ui/sidebar"
import { Collapsible } from "./ui/collapsible";
import { cn } from "@/lib/utils";
import { PrivyConnect } from "./privy-connect";
import Link from "next/link";

const navigation = [
    {
        title: "Discover",
        url: "/discover",
        icon: Telescope,
    },
    {
        title: "New Project",
        url: "/new-project",
        icon: Folder,
    },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { open } = useSidebar();

    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <Link
                    href="/"
                    className="mt-2 mx-auto"
                >
                    <span
                        className={cn(
                            "w-fit h-fit px-2 text-xl font-semibold",
                            open ? "" : "hidden"
                        )}
                    >
                        enklave.xyz
                    </span>
                </Link>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarMenu>
                        {navigation.map((item, index) => (
                            <Collapsible
                                key={index}
                                asChild
                                className="group/collapsible"
                            >
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        tooltip={item.title}
                                        asChild
                                    >
                                        <Link
                                            href={item.url}
                                        >
                                            {item.icon && <item.icon />}
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </Collapsible>
                        ))}
                    </SidebarMenu>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter
                className="items-end"
            >
                <SidebarTrigger />
                <PrivyConnect
                    className="w-full"
                />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    )
}