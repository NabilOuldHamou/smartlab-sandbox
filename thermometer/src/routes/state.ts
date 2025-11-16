import { Hono } from "hono";
import { currentState } from "../stateRegistry.js";

const state = new Hono();

state.get("/", async (c) => {
  return c.json({ currentState });
});

state.post("/", async (c) => {
  const newState = await c.req.json();

  if (newState.mode !== undefined) {
    currentState.mode = newState.mode;
    switch (newState.mode) {
      case "OFF":
        currentState.targetTemperature = 0;
        break;
      case "ECO":
        currentState.targetTemperature = 19;
        break;
      case "COMFORT":
        currentState.targetTemperature = 22;
        break;
    }
  }

  return c.json({ currentState });
});

export default state;
