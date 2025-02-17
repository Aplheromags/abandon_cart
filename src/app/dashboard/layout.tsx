import React from "react";

import { AppSidebar } from "@/components/layouts/app-sidebar";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ClerkLoaded, ClerkLoading, SignedIn, UserButton } from "@clerk/nextjs";
import { LoaderCircle } from "lucide-react";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex z-[10] sticky bg-background top-0 h-16 shrink-0 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">The Glam Model</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Abandoned Cart</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto flex justify-center items-center gap-2">
              <ModeToggle />
              <ClerkLoaded>
                <SignedIn>
                  <UserButton />
                </SignedIn>
              </ClerkLoaded>
              <ClerkLoading>
                <Button variant="ghost" size="icon" className="size-8" asChild>
                  <LoaderCircle className="h-[14px] w-[14px] animate-spin" />
                </Button>
              </ClerkLoading>
            </div>
          </div>
        </header>
        <div className="grainy dark:!bg-none flex flex-1 flex-col gap-4 p-4 pt-0">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default DashboardLayout;
