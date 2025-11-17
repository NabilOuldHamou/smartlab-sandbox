import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import "dotenv/config";
import { prisma } from "../prisma-client.js";
import bcrypt from "bcrypt";
import { verifyToken } from "../middleware.js";

const auth = new Hono();

auth.use("/session", verifyToken);

auth.get("/session", async (c) => {
  const authorization = c.req.header("Authorization");
  if (!authorization) {
    return c.json({ error: "No token provided" }, 401);
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    return c.json({ error: "Invalid token format" }, 401);
  }

  const verified = (await verify(token, process.env.JWT_SECRET!)) as {
    id?: string;
  } | null;
  if (!verified || typeof verified.id !== "string") {
    return c.json({ error: "Invalid token" }, 401);
  }

  const user = await prisma.users.findUnique({
    where: {
      id: verified.id,
    },
    select: {
      id: true,
      email: true,
      username: true,
    },
  });

  if (!user) {
    return c.json({ error: "User not found" }, 404);
  }

  return c.json(user);
});

auth.post("/login", async (c) => {
  const body = await c.req.json();
  if (!body.password || !body.email) {
    return c.json({ error: "Invalid request" }, 400);
  }

  const user = await prisma.users.findUnique({
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
    const user = await prisma.users.create({
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
