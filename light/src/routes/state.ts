import { Hono } from "hono";
import { currentState } from "../stateRegistry.js";

const state = new Hono();

state.get("/", (c) => {
  return c.json({ currentState });
});

state.post("/", async (c) => {
  const body = await c.req.json();

  if (body.power === undefined && body.brightness === undefined && body.color === undefined) {
    return c.json({ error: "Missing capabilities" }, 400);
  }
  currentState.power = body.power;
  currentState.brightness = body.brightness;
  currentState.color = body.color;

  return c.json({ currentState });
});

export default state;
