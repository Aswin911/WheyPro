import Fastify from "fastify";

import cors from "@fastify/cors";
import helmet from "@fastify/helmet";
import rateLimit from "@fastify/rate-limit";

import { env } from "./config/env.js";
import { registerDatabase } from "./plugins/database.js";

import healthRoutes from "./routes/health.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";

import jwt from "@fastify/jwt";
import cookie from "@fastify/cookie";

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

  // JWT configuration
  fastify.register(jwt, {
  secret: env.JWT_ACCESS_SECRET,

  sign: {
    algorithm: "HS256",
    expiresIn: "10m",
    iss: "wheypro-api",
    aud: "wheypro-client"
  },

  verify: {
    algorithms: ["HS256"],
    allowedIss: "wheypro-api",
    allowedAud: "wheypro-client"
  }
});

// Cookie support
  fastify.register(cookie);

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