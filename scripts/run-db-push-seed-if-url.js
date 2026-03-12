/**
 * Exécute prisma db push et db:seed uniquement si DATABASE_URL est définie
 * et pointe vers une vraie base (pas l'URL factice du build).
 * Ainsi, sur Vercel avec DATABASE_URL configurée, le build remplit la base.
 */
const { execSync } = require("child_process");

const url = process.env.DATABASE_URL || "";
const isDummy =
  url.includes("localhost") ||
  url.includes("/build") ||
  url.length < 20;

if (isDummy) {
  console.log(
    "[build] DATABASE_URL absente ou factice : skip db push et seed."
  );
  process.exit(0);
}

try {
  console.log("[build] DATABASE_URL détectée : db push et seed...");
  execSync("npx prisma db push --accept-data-loss", {
    stdio: "inherit",
    env: process.env,
  });
  execSync("npm run db:seed", {
    stdio: "inherit",
    env: process.env,
  });
  console.log("[build] db push et seed terminés.");
} catch (e) {
  console.warn(
    "[build] db push ou seed en erreur (base injoignable ou déjà à jour) :",
    e.message
  );
  process.exit(0);
}
