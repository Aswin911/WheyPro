import { registerSchema } from "./auth.schema.js";
import { registerUser } from "./auth.service.js";

import { rotateRefreshToken } from "./auth.service.js";

import { loginSchema } from "./auth.schema.js";

import {
  authenticateUser,
  createSession
} from "./auth.service.js";

import { env } from "../../config/env.js";

export async function registerController(request, reply) {

  // Validate incoming data
  const validation = registerSchema.safeParse(request.body);

  if (!validation.success) {

    return reply.code(400).send({
      success: false,
      message: "Invalid registration details",
      errors: validation.error.issues.map(issue => ({
        field: issue.path.join("."),
        message: issue.message
      }))
    });

  }

  try {

    const user = await registerUser(
      request.server.mongo.db,
      validation.data
    );

    return reply.code(201).send({
      success: true,
      message: "Registration successful",
      user
    });

  } catch (error) {

    if (error.code === "ACCOUNT_CONFLICT" || error.code === 11000) {

      return reply.code(409).send({
        success: false,
        message: "Username or email is already in use"
      });

    }

    // Log only safe error metadata, not request credentials
    request.log.error({
      errorName: error.name,
      errorCode: error.code
    }, "Registration failed");

    return reply.code(500).send({
      success: false,
      message: "Something went wrong. Please try again later."
    });

  }

}

export async function loginController(request, reply) {

  // 1. Validate request
  const validation = loginSchema.safeParse(request.body);

  if (!validation.success) {

    return reply.code(400).send({
      success: false,
      message: "Invalid login details"
    });

  }

  const { email, password } = validation.data;

  try {

    // 2. Authenticate user
    const user = await authenticateUser(
      request.server.mongo.db,
      email,
      password
    );

    if (!user) {

      return reply.code(401).send({
        success: false,
        message: "Invalid email or password"
      });

    }

    // 3. Create refresh session
    const session = await createSession(
      request.server.mongo.db,
      user._id
    );

    // 4. Generate access JWT
    const accessToken = request.server.jwt.sign({

      sub: user._id.toString(),

      sid: session.sessionId

    });

    // 5. Set refresh token cookie
    reply.setCookie(
      "wheypro_refresh",
      session.refreshToken,
      {
        httpOnly: true,

        secure: env.NODE_ENV === "production",

        sameSite: "lax",

        path: "/api/auth",

        maxAge: 7 * 24 * 60 * 60
      }
    );

    // 6. Return safe user information
    return reply.code(200).send({

      success: true,

      message: "Login successful",

      accessToken,

      user: {
        id: user._id.toString(),
        username: user.username,
        email: user.email,
        role: user.role
      }

    });

  } catch (error) {

    request.log.error({
      errorName: error.name,
      errorCode: error.code
    }, "Login failed");

    return reply.code(500).send({
      success: false,
      message: "Something went wrong. Please try again later."
    });

  }

}

export async function refreshController(request, reply) {
  const refreshToken = request.cookies.wheypro_refresh;

  if (!refreshToken) {
    return reply.code(401).send({
      success: false,
      message: "Refresh token is missing"
    });
  }

  try {
    const result = await rotateRefreshToken(
      request.server.mongo.db,
      refreshToken
    );

    if (!result) {
      reply.clearCookie("wheypro_refresh", {
        path: "/api/auth"
      });

      return reply.code(401).send({
        success: false,
        message: "Invalid or expired refresh token"
      });
    }

    // Generate a new access token
    const accessToken = request.server.jwt.sign({
      sub: result.user.id,
      sid: result.sessionId
    });

    // Set the newly rotated refresh token
    reply.setCookie("wheypro_refresh", result.refreshToken, {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/api/auth",
      maxAge: 7 * 24 * 60 * 60
    });

    return reply.code(200).send({
      success: true,
      message: "Token refreshed successfully",
      accessToken,
      user: result.user
    });

  } catch (error) {
    request.log.error(
      { err: error },
      "Refresh token operation failed"
    );

    return reply.code(500).send({
      success: false,
      message: "Unable to refresh session"
    });
  }
}