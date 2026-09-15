import { existsSync } from "node:fs";
import path from "node:path";
import { defineConfig } from "prisma/config";

// A prisma.config.ts file disables Prisma's automatic .env loading, so the
// datasource URLs in prisma/schema.prisma would resolve to undefined locally
// without this. Node's built-in loader avoids depending on `dotenv`, which is
// only present here transitively. Guarded because deployed builds (Vercel) run
// `prisma generate` with no .env file — the vars come from the platform.
const envPath = path.join(__dirname, ".env");
if (existsSync(envPath)) {
  process.loadEnvFile(envPath);
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "tsx prisma/seed.ts",
  },
});
