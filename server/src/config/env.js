import dotenv from "dotenv"
import {z} from "zod"

dotenv.config()

const envSchema = z.object({
    NODE_ENV: z.enum(["development","production","test"])
    .default("development"),

    PORT: z.coerce.number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),

    JWT_ACCESS_SECRET: z.string().min(64),

    CSRF_SECRET: z.string().min(64),

    MONGODB_URI: z.string().min(1),

    FRONTEND_URL: z.string().url()
});

export const env = envSchema.parse(process.env)