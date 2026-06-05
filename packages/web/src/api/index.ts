import { Hono } from 'hono';
import { cors } from "hono/cors"

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5178",
  "http://127.0.0.1:5179",
  "https://extraordinary-profile-os-dc22.vercel.app",
]);

const app = new Hono()
  .basePath('api')
  .use(cors({
    origin: (origin) => {
      if (!origin) return "https://extraordinary-profile-os-dc22.vercel.app";
      if (allowedOrigins.has(origin) || origin.endsWith(".vercel.app")) return origin;
      return "https://extraordinary-profile-os-dc22.vercel.app";
    },
    credentials: true,
    exposeHeaders: ["set-auth-token"],
  }))
  .get('/ping', (c) => c.json({ message: `Pong! ${Date.now()}` }, 200))
  .get('/health', (c) => c.json({ status: 'ok' }, 200));

export type AppType = typeof app;
export default app;
