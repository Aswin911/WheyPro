import {
  registerController,
  loginController,
  refreshController
} from "./auth.controller.js";

import { authenticate,authorize } from "./auth.middleware.js";
import { logoutController } from "./auth.controller.js";
// import { success } from "zod";

async function authRoutes(fastify) {

  // Registration
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

  // Login
  fastify.post(
    "/login",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "15 minutes"
        }
      }
    },
    loginController
  );

  fastify.get(
  "/me",
  {
    preHandler: authenticate
  },
  async (request, reply) => {
    return reply.code(200).send({
      success: true,
      message: "Authenticated user retrieved successfully",
      user: request.authUser
    });
  }
);

  fastify.post(
    "/refresh",
    {
      config:{
        rateLimit:{
          max:20,
          timeWindow: "15 minutes"
        }
      }
    },
    refreshController
  );

  fastify.post(
    "/logout",
    {
      config:{
        rateLimit:{
          max:20,
          timeWindow: "15 minutes"
        }
      }
    },
    logoutController
  )

  // Temporary RBAC testing endpoint
fastify.get(
  "/admin-check",
  {
    preHandler: [
      authenticate,
      authorize("admin")
    ]
  },
  async (request, reply) => {

    return reply.code(200).send({
      success: true,
      message: "Welcome, Admin!",
      user: request.authUser
    });

  }
);
}

export default authRoutes;