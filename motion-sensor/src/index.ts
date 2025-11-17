import { serve } from "@hono/node-server";
import { Hono } from "hono";
import state from "./routes/state.js";
import { searchForGateways } from "./active-search.js";
import { checkMovement } from "./event-simulator.js";
import { registration } from "./stateRegistry.js";

const app = new Hono();

app.route("/api/v1/state", state);
serve(
  {
    fetch: app.fetch,
    port: 3003,
  },
  (info) => {
    console.log(`Motion server running on port : ${info.port}`);
  }
);

await searchForGateways();

setInterval(async () => {
  await checkMovement();
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
