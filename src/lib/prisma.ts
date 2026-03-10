import { PrismaClient } from "@prisma/client";

// Déclarer le client globalement pour éviter les connexions multiples en mode "dev"
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query"], // Optionnel : affiche les requêtes SQL dans votre console pour déboguer
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
