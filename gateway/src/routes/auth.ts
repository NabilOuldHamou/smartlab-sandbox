import { Hono } from "hono";
import { sign } from "hono/jwt";
import "dotenv/config";
import { prisma } from "../prisma-client.js";
import bcrypt from "bcrypt";

const auth = new Hono();

auth.post("/login", async (c) => {
  const body = await c.req.json();
  if (!body.password || !body.email) {
    return c.json({ error: "Invalid request" }, 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      email: body.email,
    },
  });

  if (!user) {
    return c.json({ error: "Invalid email/password" }, 400);
  }

  const checkPassword = await bcrypt.compare(body.password, user.password);
  if (!checkPassword) {
    return c.json({ error: "Invalid email/password" }, 400);
  }

  const payload = {
    id: user.id,
    exp: Math.floor(Date.now() / 1000) + 3600 * 24, // Token expires in 24 hours
  };

  const userData = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  const token = await sign(payload, process.env.JWT_SECRET!);
  return c.json({ token, user: userData });
});

auth.post("/register", async (c) => {
  const body = await c.req.json();
  if (!body.password || !body.email) {
    return c.json({ error: "Invalid request" }, 400);
  }

  const encryptedPassword = await bcrypt.hash(body.password, 14);

  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: encryptedPassword,
        username: body.username,
      },
      omit: {
        password: true,
        createdAt: true,
      },
    });

    const payload = {
      id: user.id,
      exp: Math.floor(Date.now() / 1000) + 3600 * 24, // Token expires in 24 hours
    };

    const token = await sign(payload, process.env.JWT_SECRET!);
    return c.json({ token, user });
  } catch (error) {
    return c.json({ error: "User already exists." });
  }
});

export default auth;
