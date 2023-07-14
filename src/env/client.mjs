// @ts-check
// import { clientEnv, clientSchema } from "./schema.mjs";
import { PrismaClient } from '@prisma/client';

// const _clientEnv = clientSchema.safeParse(clientEnv);
const prisma = new PrismaClient();

export const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!prisma) {
  console.error(
    "❌ Invalid environment variables:\n",
  );
  throw new Error("Invalid environment variables");
}

