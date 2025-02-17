import { env } from "@/env";

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "The Glam",
  description: "Shadcn table with server side sorting, pagination, and filtering",
  url: env.NODE_ENV === "development" ? "http://localhost:3000" : "https://theglammodel.com/",
  links: { github: "https://github.com/anonymous-sherlock/theglamm-shopify" },
};
