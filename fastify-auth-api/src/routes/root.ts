import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const root: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    method: "GET",

    url: "/",

    schema: {},

    onRequest: async (request, reply) => {
      const { FAT } = request.cookies;

      try {
        if (FAT === undefined) {
          await request.jwtVerify();
        } else {
          fastify.jwt.verify(FAT);
        }
      } catch (error) {
        reply.unauthorized("Unauthorized");
      }
    },

    handler: async (request, reply) => {
      reply.send({ root: true });
    },
  });
};

export default root;
