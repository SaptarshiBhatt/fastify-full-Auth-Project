import fastifyCompress, { FastifyCompressOptions } from "@fastify/compress";
import fp from "fastify-plugin";

/**
 * This plugins adds compression utils to the Fastify reply object and a hook to decompress requests payloads. Supports gzip, deflate, and brotli.
 *
 * @see https://github.com/fastify/fastify-compress
 */

export default fp<FastifyCompressOptions>(async (fastify) => {
  fastify.register(fastifyCompress);
});
