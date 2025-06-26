import fastifyCors, { FastifyCorsOptions } from "@fastify/cors";
import fp from "fastify-plugin";

/**
 * This plugins enables the use of CORS in a Fastify application.
 *
 * @see https://github.com/fastify/fastify-cors
 */

export default fp<FastifyCorsOptions>(async (fastify) => {
  fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
  });
});
