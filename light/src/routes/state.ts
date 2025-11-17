import { Hono } from "hono";
import { currentState } from "../stateRegistry.js";

const state = new Hono();

state.get("/", (c) => {
  return c.json({ currentState });
});

state.post("/", async (c) => {
  const body = await c.req.json();

  if (
    body.power === undefined &&
    body.brightness === undefined &&
    body.color === undefined
  ) {
    return c.json({ error: "Missing capabilities" }, 400);
  }

  if (body.power !== undefined) {
    currentState.power = body.power;
  }
  if (body.brightness !== undefined) {
    currentState.brightness = body.brightness;
  }
  if (body.color !== undefined) {
    currentState.color = body.color;
  }

  return c.json({ currentState });
});

export default state;
