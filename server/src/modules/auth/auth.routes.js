import { registerController } from "./auth.controller.js";

async function authRoutes(fastify) {

  fastify.post(
    "/register",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minutes"
        }
      }
    },
    registerController
  );

}

export default authRoutes;