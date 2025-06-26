import fastifyJwt, { FastifyJWTOptions } from "@fastify/jwt";
import fp from "fastify-plugin";
import env from "../utils/env";

/**
 * This plugins adds JWT utils for Fastify, internally it uses fast-jwt.
 *
 * @see https://github.com/fastify/fastify-jwt
 */

export default fp<FastifyJWTOptions>(async (fastify) => {
  fastify.register(fastifyJwt, {
    secret: env.APP_SECRET,
    decode: {
      complete: true,
    },
    sign: {
      iss: "fstAuth",
    },
    verify: {
      allowedIss: "fstAuth",
    },
    cookie: {
      cookieName: "FAT",
      signed: true,
    },
  });
});
