import { Hono } from "hono";
import { verifyToken } from "../middleware.js";
import { prisma } from "../prisma-client.js";

const rules = new Hono();

rules.use(verifyToken);

rules.get("/", async (c) => {
  const rules = await prisma.rules.findMany();
  return c.json({ rules });
});

rules.post("/", async (c) => {
  const body = await c.req.json();

  const newRule = await prisma.rules.create({
    data: {
      name: body.name,
      when: body.when,
      then: body.then,
    },
  });
  return c.json({ rule: newRule });
});

rules.put("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();

  const updatedRule = await prisma.rules.update({
    where: {
      id: id,
    },
    data: {
      name: body.name,
      when: body.when,
      then: body.then,
    },
  });

  return c.json({ rule: updatedRule });
});

rules.delete("/:id", async (c) => {
  const id = c.req.param("id");

  await prisma.rules.delete({
    where: {
      id: id,
    },
  });
  return c.json({ message: "Rule deleted successfully" });
});

export default rules;
