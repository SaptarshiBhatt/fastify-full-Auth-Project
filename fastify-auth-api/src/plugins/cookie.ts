import fastifyCookie, { FastifyCookieOptions } from "@fastify/cookie";
import fp from "fastify-plugin";
import env from "../utils/env";

/**
 * This plugins adds some utilities to handle cookie
 *
 * @see https://github.com/fastify/fastify-cookie
 */

export default fp<FastifyCookieOptions>(async (fastify) => {
  fastify.register(fastifyCookie, {
    secret: env.APP_SECRET,
    parseOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: "auto",
      path: "/",
    },
  });
});
