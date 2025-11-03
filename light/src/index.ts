import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import telemetry from './routes/telemetry.js';

const app = new Hono();

app.route("/api/v1/telemetry", telemetry);

serve({
  fetch: app.fetch,
  port: 41000
}, (info) => {
  console.log(`Light server running on port : ${info.port}`);
});

export default app;