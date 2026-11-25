import argon2 from "argon2";

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