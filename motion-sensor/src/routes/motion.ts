import { Hono } from "hono";
import { motionState } from "../stateRegistry.js";

const motion = new Hono();

motion.get("/", async (c) => {
  return c.json({ motionState });
});

motion.put("/", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const { motionDetected, battery } = body;

  if (typeof motionDetected !== "undefined" && typeof motionDetected !== "boolean") {
    return c.json({ error: "`motionDetected` must be a boolean" }, 400);
  }

  if (typeof battery !== "undefined") {
    const b = Number(battery);
    if (!Number.isFinite(b) || b < 0 || b > 100) {
      return c.json({ error: "`battery` must be a number between 0 and 100" }, 400); // On va eviter les decimals et les conneries
    }
    motionState.battery = Math.round(b);
  }

  if (typeof motionDetected === "boolean") motionState.motionDetected = motionDetected;

  return c.json({ motionState });
});
export default motion;