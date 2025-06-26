import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

/**
 * User logout route handler
 * Supports both cookie-based and JWT-based authentication methods
 */

const logout: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    method: "POST",
    url: "/logout",

    schema: {},

    handler: async (request, reply) => {
      // Extract the Fastify Authentication Token from cookies
      const { FAT } = request.cookies;

      try {
        // Case 1: No cookie but JWT in Authorization header
        // This handles API clients that don't use cookies but Authorization header
        if (FAT === undefined) {
          // Verify the JWT from Authorization header and extract user ID
          const { id } = await request.jwtVerify<{ id: string }>();

          // Clear user's token in database
          await fastify.prisma.userAccount.update({
            where: {
              id: id,
            },
            data: {
              token: null, // Invalidate the token in database
            },
          });

          return reply.code(200).send({
            message: "Logout successful",
          });
        }

        // Case 2: Empty cookie - user is already logged out
        if (FAT === "") {
          return reply.code(200).send({
            message: "Already Logged Out",
          });
        }

        // Case 3: Valid cookie token present
        if (FAT !== undefined && FAT !== "") {
          // Verify the token from cookie and extract user ID
          const { id } = fastify.jwt.verify<{ id: string }>(FAT);

          // Clear user's token in database
          await fastify.prisma.userAccount.update({
            where: {
              id: id,
            },
            data: {
              token: null, // Invalidate the token in database
            },
          });

          // Remove the authentication cookie from client
          reply.clearCookie("FAT", {
            path: "/", // Cookie is valid for all paths
          });

          return reply.code(200).send({
            message: "Logout successful",
          });
        }
      } catch (error) {
        // Log any errors that occur during the logout process
        fastify.log.error(error);

        // Return a generic error message to the client
        return reply.internalServerError("User Logout Failed");
      }
    },
  });
};

export default logout;
