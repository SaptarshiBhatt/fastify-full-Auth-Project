import { z } from "zod";
import { loginSchema, registerSchema } from "./allSchemas";

export type RegisterType = z.infer<typeof registerSchema>;

export type LoginType = z.infer<typeof loginSchema>;

export type DefaultRequestType = { message: string };
