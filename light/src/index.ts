import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import state from './routes/state.js';

const app = new Hono();

app.route("/api/v1/state", state);

serve({
  fetch: app.fetch,
  port: 3001
}, (info) => {
  console.log(`Gateway server running on port : ${info.port}`);
});

export default app;