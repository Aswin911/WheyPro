export async function authenticate(request, reply) {
  // Step 1: Verify the JWT
  try {
    await request.jwtVerify();
  } catch {
    return reply.code(401).send({
      success: false,
      message: "Invalid or expired access token"
    });
  }

  // Step 2: Extract JWT claims
  const { sub, sid } = request.user;

  const ObjectId = request.server.mongo.ObjectId;

  if (!ObjectId.isValid(sub) || !ObjectId.isValid(sid)) {
    return reply.code(401).send({
      success: false,
      message: "Invalid authentication token"
    });
  }

  try {
    const db = request.server.mongo.db;

    // Step 3: Verify the session
    const session = await db.collection("sessions").findOne({
      _id: new ObjectId(sid),
      userId: new ObjectId(sub),
      revokedAt: null,
      expiresAt: { $gt: new Date() }
    });

    if (!session) {
      return reply.code(401).send({
        success: false,
        message: "Session is invalid or expired"
      });
    }

    // Step 4: Verify the user account
    const user = await db.collection("users").findOne({
      _id: new ObjectId(sub),
      isActive: true
    });

    if (!user) {
      return reply.code(401).send({
        success: false,
        message: "User account is inactive or unavailable"
      });
    }

    // Step 5: Attach safe user information to the request
    request.authUser = {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    };

  } catch (error) {
    request.log.error({ err: error }, "Authentication database check failed");

    return reply.code(503).send({
      success: false,
      message: "Authentication service temporarily unavailable"
    });
  }
}

export function authorize(...allowedRoles) {

  return async function (request, reply) {

    // Ensure authentication middleware ran first
    if (!request.authUser) {
      return reply.code(401).send({
        success: false,
        message: "Authentication required"
      });
    }

    // Check whether the user's role is permitted
    if (!allowedRoles.includes(request.authUser.role)) {
      return reply.code(403).send({
        success: false,
        message: "You do not have permission to access this resource"
      });
    }

  };

}