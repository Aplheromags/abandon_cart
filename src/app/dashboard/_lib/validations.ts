import { createSearchParamsCache, parseAsArrayOf, parseAsInteger, parseAsString, parseAsStringEnum } from "nuqs/server";
import * as z from "zod";

import { getFiltersStateParser, getSortingStateParser } from "@/lib/parsers";
import { Cart_Status, CartItem } from "@prisma/client";

export const searchParamsCache = createSearchParamsCache({
  flags: parseAsArrayOf(z.enum(["advancedTable", "floatingBar"])).withDefault([]),
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  sort: getSortingStateParser<CartItem>().withDefault([{ id: "createdAt", desc: true }]),
  productName: parseAsString.withDefault(""),
  status: parseAsArrayOf(z.nativeEnum(Cart_Status)).withDefault([]),
  from: parseAsString.withDefault(""),
  to: parseAsString.withDefault(""),
  // advanced filter
  filters: getFiltersStateParser().withDefault([]),
  joinOperator: parseAsStringEnum(["and", "or"]).withDefault("and"),
});

export const createCartSchema = z.object({
  title: z.string(),
  status: z.nativeEnum(Cart_Status).default("PENDING"),

  productId: z.string(),
  productName: z.string(),
  productImage: z.string().optional(),
  productPrice: z.number(),
  productQty: z.number().default(1),
  productSku: z.string().optional(),

  properties: z.object({}).optional(),

  ipAddress: z.string().optional(),
  userAgent: z.string().optional(),
});

export const updateCartItemSchema = z.object({
  productId: z.string().optional(),
  productName: z.string().optional(),
  productImage: z.string().optional(),
  productPrice: z.number().optional(),
  productSku: z.string().optional(),
  productQty: z.number().optional(),

  properties: z.object({}).optional(),
  status: z.nativeEnum(Cart_Status).optional(),
});

export type GetCartItemsSchema = Awaited<ReturnType<typeof searchParamsCache.parse>>;
export type CreateCartSchema = z.infer<typeof createCartSchema>;
export type UpdateCartItemSchema = z.infer<typeof updateCartItemSchema>;
