/**
 * Create or update an admin user.
 *
 *   tsx prisma/create-admin.ts <email> <password> [name]
 *
 * Credentials are passed as CLI arguments so no secrets are committed to the
 * repository. Passwords are hashed with scrypt in the same `salt:hash` format
 * used by `src/lib/auth.ts` (verifyPassword).
 */
import { PrismaClient } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

async function main() {
  const [, , emailArg, passwordArg, ...nameParts] = process.argv;

  if (!emailArg || !passwordArg) {
    console.error(
      'Usage: tsx prisma/create-admin.ts <email> <password> ["Full Name"]',
    );
    process.exit(1);
  }

  const email = emailArg.trim().toLowerCase();
  const name = nameParts.join(" ").trim() || "Administrator";
  const passwordHash = hashPassword(passwordArg);

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: { name, passwordHash },
    create: { email, name, passwordHash },
  });

  console.log(`✓ admin account ready: ${admin.email}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
