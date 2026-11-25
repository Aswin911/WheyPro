export async function createIndexes(db) {

  const users = db.collection("users");
  const sessions = db.collection("sessions");

  await users.createIndex(
    { email: 1 },
    {
      unique: true,
      name: "unique_email"
    }
  );

  await users.createIndex(
    { username: 1 },
    {
      unique: true,
      name: "unique_username"
    }
  );

  // Session indexes
  await sessions.createIndex(
    { refreshTokenHash: 1 },
    {
      unique: true,
      name: "unique_refresh_token_hash"
    }
  );

  await sessions.createIndex(
    { userId: 1 },
    {
      name: "sessions_by_user"
    }
  );

  // Automatically remove expired sessions
  await sessions.createIndex(
    { expiresAt: 1 },
    {
      expireAfterSeconds: 0,
      name: "session_expiry"
    }
  );

  console.log("MongoDB indexes created successfully");
}