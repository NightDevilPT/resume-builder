/**
 * Database Connection Utility
 * Singleton pattern for Prisma Client to avoid connection issues
 */

import { PrismaClient } from "@prisma/client";

// PrismaClient is attached to the `global` object in development to prevent
// exhausting database connections due to hot reloading in development
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
	globalForPrisma.prisma ||
	new PrismaClient({
		log:
			process.env.NODE_ENV === "development"
				? ["query", "error", "warn"]
				: ["error"],
	});

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}

/**
 * Disconnect from database
 * Useful for cleanup in serverless functions
 */
export async function disconnectDb(): Promise<void> {
	await prisma.$disconnect();
}

/**
 * Connect to database
 * Useful for explicit connection
 */
export async function connectDb(): Promise<void> {
	await prisma.$connect();
}

