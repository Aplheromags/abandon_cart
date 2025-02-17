import { Bindings } from "@/types";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { handle } from "hono/vercel";
import abandonCartOrders from "./routers/cart-order";
import { db } from "@/db";

const app = new Hono<{ Bindings: Bindings }>()
  .basePath("/api/v1")
  .use(cors())

/**
 * This is the primary router for your server.
 *
 * All routers added in /server/routers should be manually added here.
 */
app.route("/webhooks", abandonCartOrders);

app.get("/hello", async (ctx) => {
  
  await db.cartItem.create({
    data:{
      productId: "1",
      productImage:"https://theglammodel.com/cdn/shop/files/il_fullxfull.4207393294_lv4y.jpg",
      productName:"test",
      productPrice:100,
      productQty:1,
      productSku:"123",

    }
  })
    return ctx.json({ message: "Hello, World!" });
})

// The handler Next.js uses to answer API requests
export const httpHandler = handle(app);

/**
 * (Optional)
 * Exporting our API here for easy deployment
 *
 * Run `npm run deploy` for one-click API deployment to Cloudflare's edge network
 */
export default app;
