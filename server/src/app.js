import Fastify from "fastify";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import { env } from "./config/env.js";
import { registerDatabase } from "./plugins/database.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

export function buildApp(options = {}) {

  const fastify = Fastify({
    logger: true,
    ...options
  });

  fastify.register(helmet);

  fastify.register(cors, {
    origin: env.FRONTEND_URL,
    credentials: true
  });

  fastify.register(rateLimit, {
    max: 100,
    timeWindow: "1 minute"
  });

  // Register MongoDB and initialize indexes
  registerDatabase(fastify);

  // Register routes
  fastify.register(healthRoutes, {
    prefix: "/api"
  });

  fastify.register(authRoutes, {
    prefix: "/api/auth"
  });

  return fastify;
}