import { verifyHmac } from "@/lib/utils";
import { Bindings } from "@/types";
import { PrismaClient } from "@prisma/client";
import { Hono } from "hono";
import { env } from "hono/adapter";
import { revalidateTag } from "next/cache";

const abandonCartOrders = new Hono<{ Bindings: Bindings }>().post("/abandon-cart", async (c) => {
  try {
    const hmacHeader = c.req.header("x-shopify-hmac-sha256") ?? "";
    const { SHOPIFY_SECRET, DATABASE_URL } = env(c);
    const body = await c.req.text();
    const db = new PrismaClient({ datasourceUrl: DATABASE_URL, log: ["error", "warn"] });
    if (!body) {
      console.error("Request body is empty");
      return c.json({ error: "Empty request body" }, 400);
    }
    if (!verifyHmac(hmacHeader, body, SHOPIFY_SECRET)) {
      return c.json({ error: "Invalid HMAC signature" }, 400);
    }

    const data = await JSON.parse(body);
    // await writeFile("./test.json", JSON.stringify(data, null, 2)); // Specify the path to your JSON file

    await db.cartItem.create({
      data: {
        productId: String(data.line_items[0].product_id),
        productName: data.line_items[0].title,
        productImage: "",
        productPrice: parseFloat(data.line_items[0].line_price),
        productSku: data.line_items[0].sku,
        productQty: data.line_items[0].quantity,
        properties: data.line_items[0].properties,
      },
    });

    revalidateTag("cart-items");

    return c.text("ok", 200);
  } catch (err) {
    console.log(err);
    return c.status(400);
  }
});

export default abandonCartOrders;
