import { Hono } from "hono";
import { currentState } from "../stateRegistry.js";

const state = new Hono();

state.get("/", async (c) => {
  return c.json({ currentState });
});

export default state;
