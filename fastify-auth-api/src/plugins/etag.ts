import fastifyEtag, { FastifyEtagOptions } from "@fastify/etag";
import fp from "fastify-plugin";

/**
 * This plugins automatically generate ETags for HTTP responses
 *
 * @see https://github.com/fastify/fastify-etag
 */

export default fp<FastifyEtagOptions>(async (fastify) => {
  fastify.register(fastifyEtag);
});
