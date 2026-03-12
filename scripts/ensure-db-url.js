/**
 * Définit DATABASE_URL avec une valeur factice si elle est absente,
 * pour que "prisma generate" puisse s'exécuter au build (ex: Vercel sans env).
 * La vraie DATABASE_URL doit être configurée en production pour le runtime.
 */
const { execSync } = require("child_process");

if (!process.env.DATABASE_URL) {
  process.env.DATABASE_URL =
    "postgresql://build:build@localhost:5432/build?schema=public";
}

execSync("npx prisma generate", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: process.env.DATABASE_URL },
});
