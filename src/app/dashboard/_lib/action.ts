"use server";

import { db } from "@/db";
import { getErrorMessage } from "@/lib/handle-error";
import { revalidateTag, unstable_noStore } from "next/cache";
import { UpdateCartItemSchema } from "./validations";

export async function updateCartItem(input: UpdateCartItemSchema & { id: number }) {
  unstable_noStore();
  try {
    const data = await db.cartItem.update({
      where: {
        id: input.id,
      },
      data: {
        productId: input.productId,
        productImage: input.productImage,
        productName: input.productName,
        productPrice: input.productPrice,
        properties: input.properties,
        productQty: input.productQty,
        productSku: input.productSku,

        status: input.status,
      },
    });

    revalidateTag("cart-items");
    if (data.status === input.status) {
      revalidateTag("cart-status-counts");
    }

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}

export async function deleteCartItems(input: { ids: number[] }) {
  unstable_noStore();
  try {
    await db.cartItem.deleteMany({
      where: {
        id: {
          in: input.ids,
        },
      },
    });

    revalidateTag("cart-items");
    revalidateTag("cart-status-counts");

    return {
      data: null,
      error: null,
    };
  } catch (err) {
    return {
      data: null,
      error: getErrorMessage(err),
    };
  }
}
