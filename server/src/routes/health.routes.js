async function healthRoutes(fastify){
    fastify.get("/health", async(request,reply) =>{
        try {
            await fastify.mongo.db.command({ ping: 1 });

            return {
                message: "WheyPro API is running",
                success: true,
                database: "connected"
            };
        } catch (error) {
            request.log.error(
                {err:error},
                "Database health check failed"
            )

            return reply.code(503).send({
                success: false,
                message: "Service temporarily unavailable"
            })
        }
    })
}

export default healthRoutes;