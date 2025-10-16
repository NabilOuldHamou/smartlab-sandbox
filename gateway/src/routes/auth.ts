import { Hono } from "hono";

const auth = new Hono();

auth.post("/register", async (c) => {
    const body = await c.req.json(); 
});