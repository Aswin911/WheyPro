import { registerSchema } from "./auth.schema.js";
import { registerUser } from "./auth.service.js";

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