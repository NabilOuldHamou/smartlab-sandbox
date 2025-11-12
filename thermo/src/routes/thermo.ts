import { Hono } from "hono";
import { thermostatState, thermostatCapabilities } from "../stateRegistry.js";

const thermo = new Hono();

thermo.get("/", async (c) => {
  return c.json({ thermostatState });
});

thermo.put("/", async (c) => {
  let body: any;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const { currentTemperature, targetTemperature, mode, hvacRunning } = body;

  // validations
  if (typeof currentTemperature !== "undefined") {
    const v = Number(currentTemperature);
    const [min, max] = thermostatCapabilities.temperature.range;
    if (!Number.isFinite(v) || v < min || v > max) {
      return c.json({ error: "`currentTemperature` must be a number between " + min + " and " + max }, 400);
    }
    thermostatState.currentTemperature = v;
  }

  if (typeof targetTemperature !== "undefined") {
    const v = Number(targetTemperature);
    const [min, max] = thermostatCapabilities.temperature.range;
    if (!Number.isFinite(v) || v < min || v > max) {
      return c.json({ error: "`targetTemperature` must be a number between " + min + " and " + max }, 400);
    }
    thermostatState.targetTemperature = v;
  }

  if (typeof mode !== "undefined") {
    if (!thermostatCapabilities.mode.includes(mode)) {
      return c.json({ error: "`mode` must be one of: " + thermostatCapabilities.mode.join(", ") }, 400);
    }
    thermostatState.mode = mode;
  }

  if (typeof hvacRunning !== "undefined" && typeof hvacRunning !== "boolean") {
    return c.json({ error: "`hvacRunning` must be a boolean" }, 400);
  }
  if (typeof hvacRunning === "boolean") thermostatState.hvacRunning = hvacRunning;

  // update timestamp if any change was provided
  if (Object.keys(body).length > 0) {
    thermostatState.lastUpdated = new Date().toISOString();
  }

  return c.json({ thermostatState });
});
export default thermo;