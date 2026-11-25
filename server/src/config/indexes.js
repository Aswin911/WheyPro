export async function createIndexes(db) {

  const users = db.collection("users");

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

  console.log("MongoDB indexes created successfully");
}