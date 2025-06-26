import {
  FastifyPluginAsyncTypebox,
  Type,
} from "@fastify/type-provider-typebox";
import { verify } from "argon2";
import env from "../../utils/env";

/**
 * User login route handler
 * Manages user authentication, token generation, and session management
 */

const login: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    method: "POST", // HTTP method for user login
    url: "/login", // Endpoint URL

    // JSON Schema validation for request body
    // Ensures input data meets specific criteria
    schema: {
      body: Type.Object({
        // Email: Must be a valid email format
        email: Type.String({ format: "email" }),
        // Password: Between 6-25 characters
        password: Type.String({ minLength: 6, maxLength: 25 }),
      }),
    },

    // Main handler for login logic
    handler: async (request, reply) => {
      const { email, password } = request.body;

      // Normalize email to ensure consistent comparison
      const normalizedEmail = email.toLowerCase().trim();

      try {
        // Attempt to find user by email
        // Selecting multiple fields for authentication and token management
        const existingUser = await fastify.prisma.userAccount.findUnique({
          where: {
            email: normalizedEmail,
          },
          select: {
            id: true, // User identifier
            email: true, // For potential additional checks
            password: true, // Hashed password for verification
            token: true, // Existing authentication token
          },
        });

        // Handle case where no user is found
        if (existingUser === null) {
          return reply.notFound(
            "Account not found, Please create an account first"
          );
        }

        // Verify password using Argon2 (constant-time comparison)
        const isPasswordCorrect = await verify(
          existingUser.password,
          password,
          {
            secret: Buffer.from(env.APP_SECRET),
          }
        );

        // Reject login if password is incorrect
        if (!isPasswordCorrect) {
          return reply.unauthorized("Incorrect password");
        }

        // Scenario 1: User already has a valid token
        // Simply set the existing token as a cookie
        if (existingUser.token !== null && existingUser.token !== "") {
          return reply.setCookie("FAT", existingUser.token).code(201).send({
            message: "User login successful",
          });
        }

        // Scenario 2: User has no existing token
        // Generate a new JWT token
        if (existingUser.token === null || existingUser.token === "") {
          // Create a new access token using JWT, embedding user ID
          const accessToken = await fastify.jwt.sign({
            id: existingUser.id,
          });

          // Update user record with new token
          await fastify.prisma.userAccount.update({
            where: {
              id: existingUser.id,
            },
            data: {
              token: accessToken,
            },
          });

          // Set token as an HTTP-only cookie and send success response
          return reply.setCookie("FAT", accessToken).code(201).send({
            message: "User login successful",
          });
        }
      } catch (error) {
        // Log any unexpected errors for debugging
        fastify.log.error(error);

        // Generic error response to prevent information leakage
        return reply.internalServerError("User Login Failed");
      }
    },
  });
};

export default login;
