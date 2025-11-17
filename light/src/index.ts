import { serve } from "@hono/node-server";
import { Hono } from "hono";
import state from "./routes/state.js";
import { searchForGateways } from "./active-search.js";
import { registration } from "./stateRegistry.js";

const app = new Hono();

app.route("/api/v1/state", state);
serve(
  {
    fetch: app.fetch,
    port: 3002,
  },
  (info) => {
    console.log(`Light server running on port : ${info.port}`);
  }
);

await searchForGateways();

setInterval(async () => {
  if (!registration.registered) {
    await searchForGateways();
    return;
  }

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
