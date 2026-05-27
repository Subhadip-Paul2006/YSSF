import { defineConfig } from "prisma/config";
import dotenv from "dotenv";

dotenv.config();

const dbUrl = process.env.DATABASE_URL || "";
// For schema push/migrations, use session-mode pooler (port 5432) without pgbouncer
const directUrl = dbUrl.replace(":6543/", ":5432/").replace("?pgbouncer=true", "");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: directUrl || dbUrl,
  },
  migrations: {
    seed: "npx tsx prisma/seed.ts",
  },
});
