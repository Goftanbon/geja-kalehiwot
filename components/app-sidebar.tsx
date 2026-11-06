"use client";

import * as React from "react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { T, type Lang } from "@/lib/translations";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboardIcon,
  ListIcon,
  ChartBarIcon,
  FolderIcon,
  UsersIcon,
  CameraIcon,
  FileTextIcon,
  Settings2Icon,
  CircleHelpIcon,
  SearchIcon,
  DatabaseIcon,
  FileChartColumnIcon,
  FileIcon,
  CommandIcon,
  Building,
  Newspaper,
  CalendarDays,
} from "lucide-react";
import Link from "next/link";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboardIcon />,
    },
    {
      title: "Carousel",
      url: "/admin/carousel",
      icon: <ListIcon />,
    },
    {
      title: "Event",
      url: "/admin/event",
      icon: <CalendarDays />,
    },
    {
      title: "News",
      url: "#",
      icon: <Newspaper />,
    },
    {
      title: "Department",
      url: "#",
      icon: <Building />,
    },
    {
      title: "Users",
      url: "#",
      icon: <UsersIcon />,
    },
  ],
  // navClouds: [
  //   {
  //     title: "Product",
  //     icon: <CameraIcon />,
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: <FileTextIcon />,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: <FileTextIcon />,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  navSecondary: [
    // {
    //   title: "Settings",
    //   url: "#",
    //   icon: <Settings2Icon />,
    // },
    // {
    //   title: "Get Help",
    //   url: "#",
    //   icon: <CircleHelpIcon />,
    // },
    // {
    //   title: "Search",
    //   url: "#",
    //   icon: <SearchIcon />,
    // },
  ],
  documents: [
    {
      name: "Products",
      url: "#",
      icon: <DatabaseIcon />,
    },
    {
      name: "Orders",
      url: "#",
      icon: <FileChartColumnIcon />,
    },
    {
      name: "Donations",
      url: "#",
      icon: <FileIcon />,
    },
  ],
};
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [lang, setLang] = React.useState<Lang>("en");
  const t = T[lang];
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <Link href={"/"}>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="data-[slot=sidebar-menu-button]:p-1.5!"
                render={<a href="#" />}
              >
                <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full bg-brand text-brand-foreground">
                  <img
                    src="/logo.jpg"
                    alt="Geja Kalehiwot"
                    className="size-full object-cover"
                  />
                </span>
                <span className="text-base font-semibold">Geja Kalehiwot</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
