import { z } from "zod";

export const registerSchema = z.object({

  username: z.string()
    .trim()
    .toLowerCase()
    .min(3, "Username must contain at least 3 characters")
    .max(30, "Username cannot exceed 30 characters")
    .regex(
      /^[a-z0-9_]+$/,
      "Username can only contain letters, numbers and underscores"
    ),

  email: z.string()
    .trim()
    .toLowerCase()
    .email("Invalid email address")
    .max(254),

  password: z.string()
    .min(15, "Password must contain at least 15 characters")
    .max(128, "Password cannot exceed 128 characters"),

  confirmPassword: z.string()

}).strict().refine(
  data => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"]
  }
);

export const loginSchema = z.object({
  email: z.string()
  .trim()
  .toLowerCase()
  .email()
  .max(254),

  password: z.string()
  .min(1)
  .max(128)
}).strict();