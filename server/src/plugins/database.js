import mongodb from "@fastify/mongodb";
import { env } from "../config/env.js";
import { createIndexes } from "../config/indexes.js";

export function registerDatabase(fastify) {

  fastify.register(mongodb, {
    url: env.MONGODB_URI
  });

  // Run after registered plugins are ready
  fastify.addHook("onReady", async function () {
    console.log(
    "Connected database:",
    fastify.mongo.db.databaseName
  );

  console.log(
    "MongoDB collections:",
    await fastify.mongo.db.listCollections().toArray()
  );

    await createIndexes(fastify.mongo.db);

    fastify.log.info("Database indexes initialized");
  });
}