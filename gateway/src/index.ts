import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { runDiscovery } from './active-discovery.js'
import discover from './routes/discover.js';

const app = new Hono()

app.route("/api/v1/discover", discover);

// todo lights
// todo motion
// todo thermometer
// todo ai

serve({
  fetch: app.fetch,
  port: 3000
}, (info) => {
  console.log(`Gateway server running on port : ${info.port}`);
});

setInterval(() => {
  runDiscovery();
}, 30000);

export default app;
