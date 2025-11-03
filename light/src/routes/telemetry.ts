import { Hono } from "hono";
import { currentState } from "../stateRegistry.js";

const telemetry = new Hono();

telemetry.get("/", async (c) => {
  const res = await fetch("http://localhost:3000/api/v1/discover", {
    method: "POST",
    body: JSON.stringify({
      id: "room_thermometer",
      type: "sensor",
      capabilities: ["temperature", "humidity"],
      preferences: {},
    }),
  });
  console.log(res);

  return c.json({ currentState });
});

export default telemetry;
