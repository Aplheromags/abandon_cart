"use client";

import { Package2 } from "lucide-react";
import * as React from "react";

import { NavMain } from "@/components/layouts/nav-main";
import { NavUser } from "@/components/layouts/nav-user";
import { TeamSwitcher } from "@/components/layouts/team-switcher";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarRail } from "@/components/ui/sidebar";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";

const data = {
  teams: [
    {
      name: "The Glam Model",
      logo: () => <Image src="/glam-logo.avif" alt="The Glam Model" width={50} height={50} className="object-contain invert dark:invert-0" />,
      plan: "Enterprise",
    },
  ],
  navMain: [
    {
      title: "Orders",
      url: "#",
      icon: Package2,
      isActive: true,
      items: [
        {
          title: "Abandoned Cart",
          url: "/dashboard",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser(); // Use Clerk's useUser hook to get the current user

  const userNavData = user
    ? {
        name: user.fullName || user.firstName || "User", // Fallback to "User" if no name is available
        email: user.emailAddresses[0]?.emailAddress || "No email available",
        avatar: user.imageUrl || "/default-avatar.png", // Fallback avatar
      }
    : undefined;

  return (
    <Sidebar collapsible="icon" {...props} className="">
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userNavData} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
