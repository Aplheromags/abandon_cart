"use server";
import { db } from "@/db";
import { unstable_cache } from "@/lib/unstable-cache";
import { Cart_Status, Prisma } from "@prisma/client";
import { GetCartItemsSchema } from "./validations";

export async function getCartItems(input: GetCartItemsSchema) {
  return await unstable_cache(
    async () => {
      try {
        const offset = (input.page - 1) * input.perPage;
        const fromDate = input.from ? new Date(input.from) : undefined;
        const toDate = input.to ? new Date(input.to) : undefined;
        const filters = input.filters;
        // Construct advanced filter conditions
        const advancedWhere: Prisma.CartItemWhereInput = {};

        filters.forEach((ftr) => {
          if (ftr.id === "productName") {
            if (ftr.operator === "eq" && ftr.type == "text") {
              advancedWhere.productName = { equals: ftr.value as string }; // Complete the condition for equality
            }
            if (ftr.operator === "ne" && ftr.type == "text") {
              advancedWhere.productName = { not: { equals: ftr.value as string } }; // Complete the condition for equality
            }
            if (ftr.operator === "iLike" && ftr.type == "text") {
              advancedWhere.productName = { contains: ftr.value as string }; // Complete the condition for equality
            }
            if (ftr.operator === "notILike" && ftr.type == "text") {
              advancedWhere.productName = { not: { contains: ftr.value as string } }; // Complete the condition for inequality
            }
          } else if (ftr.id === "properties") {
            if (ftr.operator === "eq" && ftr.type == "text") {
              advancedWhere.properties = { path: "$._Instagram", equals: ftr.value }; // Complete the condition for equality
            }
          }
        });

        // Standard filtering conditions
        const where: Prisma.CartItemWhereInput = {
          ...(input.productName && { productName: { contains: input.productName } }),
          ...(input.status.length > 0 && { status: { in: input.status } }),
          ...(fromDate && { createdAt: { gte: fromDate } }),
          ...(toDate && { createdAt: { lte: toDate } }),
          ...(advancedWhere && advancedWhere), // Include advanced filters
        };

        // Construct sorting
        const orderBy: Prisma.CartItemOrderByWithRelationInput[] =
          input.sort.length > 0
            ? input.sort.map((item) => ({
                [item.id]: item.desc ? "desc" : "asc",
              }))
            : [{ createdAt: "asc" }];

        // Perform database queries within a transaction
        const [data, total] = await db.$transaction([
          db.cartItem.findMany({
            where,
            skip: offset,
            take: input.perPage,
            orderBy,
          }),
          db.cartItem.count({
            where,
          }),
        ]);

        const pageCount = Math.ceil(total / input.perPage);

        return { data, pageCount };
      } catch (err) {
        console.error("Error fetching cart items:", err);
        return { data: [], pageCount: 0 };
      }
    },
    [JSON.stringify(input)],
    {
      revalidate: 15,
      tags: ["cart-items"],
    }
  )();
}

export async function getCartStatusCounts() {
  return unstable_cache(
    async () => {
      try {
        const results = await db.cartItem.groupBy({
          by: ["status"],
          _count: {
            status: true,
          },
        });

        // revalidatePath("/dashboard", "page");
        // Reduce the results into a key-value object
        return results.reduce(
          (acc, { status, _count }) => {
            acc[status] = _count.status;
            return acc;
          },
          {} as Record<Cart_Status, number> // Adjust `string` if `status` has a specific type
        );
      } catch (err) {
        console.error("Error fetching status counts:", err);
        return {} as Record<Cart_Status, number>; // Adjust `string` if `status` has a specific type
      }
    },
    ["cart-status-counts"],
    {
      revalidate: 15,
      tags: ["cart-status-counts"],
    }
  )();
}
