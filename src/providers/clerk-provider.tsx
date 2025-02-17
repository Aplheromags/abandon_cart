"use client";
import React from "react";
import { ClerkProvider } from "@clerk/nextjs";

export const ClerkClientProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return <ClerkProvider>{children}</ClerkProvider>;
};
