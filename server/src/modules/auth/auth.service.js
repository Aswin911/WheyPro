import argon2 from "argon2";
import { createHash, randomBytes } from "node:crypto";

export async function hashPassword(password) {

  return await argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1
  });

}

export async function registerUser(db, data) {

  const { username, email, password } = data;

  // Hash the password before storing it
  const passwordHash = await hashPassword(password);

  const now = new Date();

  // Construct the database document ourselves.
  // Never spread the complete request body into the database.
  const newUser = {
    username,
    email,
    passwordHash,
    role: "customer",
    isActive: true,
    createdAt: now,
    updatedAt: now
  };

  try {

    const result = await db.collection("users").insertOne(newUser);

    return {
      id: result.insertedId.toString(),
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt
    };

  } catch (error) {

    // MongoDB duplicate-key error
    if (error.code === 11000) {
      const conflict = new Error("Account conflict");
      conflict.code = "ACCOUNT_CONFLICT";
      throw conflict;
    }

    throw error;
  }

}

export async function verifyPassword(password, passwordHash) {

  return await argon2.verify(passwordHash, password);

}

//Refresh token generation
export function generateRefreshToken() {

  return randomBytes(32).toString("base64url");

}


export function hashRefreshToken(token) {

  return createHash("sha256")
    .update(token)
    .digest("hex");

}

//login service
export async function authenticateUser(db, email, password) {

  const user = await db.collection("users").findOne({
    email
  });

  if (!user) {
    return null;
  }

  if (!user.isActive) {
    return null;
  }

  const isValid = await verifyPassword(
    password,
    user.passwordHash
  );

  if (!isValid) {
    return null;
  }

  return user;
}

//create session after successful login
export async function createSession(db,userId){

  const refreshToken = generateRefreshToken();

  const refreshTokenHash = hashRefreshToken(refreshToken);

  const now = new Date();

  const expiresAt = new Date(
    now.getTime() + 7*24*60*60*1000
  );

  const result = await db.collection("sessions").insertOne({
    userId,
    refreshTokenHash,
    usedRefreshTokenHashes: [],
    createdAt: now,
    expiresAt,
    revokedAt: null

  });

  return{
    sessionId: result.insertedId.toString(),
    refreshToken 
  };

}

export async function rotateRefreshToken(db, oldToken) {
  const oldHash = hashRefreshToken(oldToken);
  const now = new Date();

  const sessions = db.collection("sessions");

  // 1. Find a valid session using the current refresh-token hash
  const session = await sessions.findOne({
    refreshTokenHash: oldHash,
    revokedAt: null,
    expiresAt: { $gt: now }
  });

  // 2. If not current, check whether this token was already used
  if (!session) {
    const reusedSession = await sessions.findOne({
      usedRefreshTokenHashes: oldHash
    });

    if (reusedSession) {
      // Reuse detected: revoke the entire session
      await sessions.updateOne(
        { _id: reusedSession._id, revokedAt: null },
        { $set: { revokedAt: now } }
      );
    }

    return null;
  }

  // 3. Make sure the user is still active
  const user = await db.collection("users").findOne({
    _id: session.userId,
    isActive: true
  });

  if (!user) {
    await sessions.updateOne(
      { _id: session._id },
      { $set: { revokedAt: now } }
    );

    return null;
  }

  // 4. Generate a new refresh token
  const newRefreshToken = generateRefreshToken();
  const newHash = hashRefreshToken(newRefreshToken);

  // 5. Atomically replace the old token
  const result = await sessions.updateOne(
    {
      _id: session._id,
      refreshTokenHash: oldHash,
      revokedAt: null,
      expiresAt: { $gt: now }
    },
    {
      $set: {
        refreshTokenHash: newHash
      },
      $addToSet: {
        usedRefreshTokenHashes: oldHash
      }
    }
  );

  // Another concurrent request may have rotated it first
  if (result.modifiedCount !== 1) {
    const reusedSession = await sessions.findOne({
      _id: session._id,
      usedRefreshTokenHashes: oldHash
    });

    if (reusedSession) {
      await sessions.updateOne(
        { _id: session._id, revokedAt: null },
        { $set: { revokedAt: now } }
      );
    }

    return null;
  }

  return {
    refreshToken: newRefreshToken,
    sessionId: session._id.toString(),
    user: {
      id: user._id.toString(),
      username: user.username,
      email: user.email,
      role: user.role
    }
  };
}

export async function revokeSession(db, refreshToken) {
  const refreshTokenHash = hashRefreshToken(refreshToken);

  const result = await db.collection("sessions").updateOne(
    {
      refreshTokenHash,
      revokedAt: null
    },
    {
      $set: {
        revokedAt: new Date()
      }
    }
  );

  return result.modifiedCount === 1;
}