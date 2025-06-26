import {
  FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import { argon2id, hash } from "argon2";
import env from "../../utils/env";

/**
 * User registration route handler
 * Handles user account creation with email uniqueness check and password hashing
 */

const register: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    method: "POST", // HTTP method for user registration
    url: "/register", // Endpoint URL

    // JSON Schema validation for request body
    // Ensures input data meets specific criteria
    schema: {
      body: Type.Object({
        // First name: Required, between 1-25 characters
        firstName: Type.String({ minLength: 1, maxLength: 25 }),
        // Email: Must be a valid email format
        email: Type.String({ format: "email" }),
        // Password: Between 6-25 characters for basic security
        password: Type.String({ minLength: 6, maxLength: 25 }),
      }),
    },

    // Main handler for registration logic
    handler: async (request, reply) => {
      const { firstName, email, password } = request.body;

      // Normalize email to prevent duplicate registrations due to case or whitespace
      const normalizedEmail = email.toLowerCase().trim();

      try {
        // Check if email is already registered
        const existingUser = await fastify.prisma.userAccount.findUnique({
          where: {
            email: normalizedEmail,
          },

          select: {
            id: true, // Only fetch ID to minimize unnecessary data retrieval
          },
        });

        // Return conflict if email already exists
        if (existingUser !== null) {
          return reply.conflict("Email is already registered");
        }

        // Hash password using Argon2 with additional secret for enhanced security
        // Argon2id is resistant to both side-channel and timing attacks
        const hashedPassword = await hash(password, {
          type: argon2id,
          secret: Buffer.from(env.APP_SECRET),
        });

        // Create new user in the database
        await fastify.prisma.userAccount.create({
          data: {
            firstName: firstName.trim(), // Remove any leading/trailing whitespace
            email: normalizedEmail,
            password: hashedPassword, // Store hashed password, never plain text
          },
        });

        // Successful registration response
        return reply.code(201).send({
          message: "User registered successfully",
        });
      } catch (error) {
        // Log any unexpected errors for debugging
        fastify.log.error(error);

        // Generic error response to avoid leaking sensitive information
        return reply.internalServerError("User Registration Failed");
      }
    },
  });
};

export default register;
