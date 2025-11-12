import { serve } from "@hono/node-server";
import { Hono } from "hono";
import thermo from "./routes/thermo.js";
import { searchForGateways } from "./active-search.js";

const app = new Hono();

app.route("/api/v1/thermo", thermo);
serve(
  {
    fetch: app.fetch,
    port: 3004,
  },
  (info) => {
    console.log(`Thermo server running on port : ${info.port}`);
  }
);

// RUN DISCOVERY ON STARTUP
await searchForGateways();

export default app;
