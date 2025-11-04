import { Hono } from "hono";
import { currentState } from "../stateRegistry.js";

const telemetry = new Hono();

telemetry.get("/", async (c) => {
  return c.json({ currentState });
});

export default telemetry;
