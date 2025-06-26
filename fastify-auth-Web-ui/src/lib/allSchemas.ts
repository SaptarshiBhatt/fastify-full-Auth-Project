import { z } from "zod";

export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "Minimum 1 character long" })
    .max(25, { message: "Maximum 25 characters long" }),

  email: z.string().email({ message: "Enter a valid email" }),

  password: z
    .string()
    .min(6, { message: "Minimum 6 characters long" })
    .max(25, { message: "Maximum 25 characters long" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Enter a valid email" }),

  password: z
    .string()
    .min(6, { message: "Minimum 6 characters long" })
    .max(25, { message: "Maximum 25 characters long" }),
});
