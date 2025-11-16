import { serve } from "@hono/node-server";
import { Hono } from "hono";
import state from "./routes/state.js";
import { searchForGateways } from "./active-search.js";
import { checkTemperature } from "./event-simulator.js";
import { registration } from "./stateRegistry.js";

const app = new Hono();

app.route("/api/v1/state", state);
serve(
  {
    fetch: app.fetch,
    port: 3004,
  },
  (info) => {
    console.log(`Thermometer server running on port : ${info.port}`);
  }
);

await searchForGateways();

setInterval(async () => {
  await checkTemperature();
}, 2000);

setInterval(async () => {
  const heartbeat = await fetch(registration.heartbeatRoute, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${registration.token}`,
    },
  });

  const data = await heartbeat.json();
  registration.token = data.token;
}, 10000);

export default app;
