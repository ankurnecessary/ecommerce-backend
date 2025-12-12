import bcrypt from 'bcrypt';
import { prisma } from '../../src/lib/prisma';

async function main(): Promise<void> {
  try {
    // Do we have the only system generated user?
    const adminUser = await prisma.user.findFirst({
      where: {
        id: { equals: prisma.user.fields.createdBy },
        createdBy: { equals: prisma.user.fields.updatedBy }
      }
    });

    // If we don't have an admin user then only an admin user will be created.
    if (adminUser === null) {
      if (
        process.env.ADMIN_PASSWORD === undefined ||
        process.env.ADMIN_PASSWORD === ''
      ) {
        throw new Error(
          'ADMIN_PASSWORD environment variable is required for seeding'
        );
      }

      // Read ADMIN_EMAIL once and handle missing value differently in production vs non-production
      let adminEmail = process.env.ADMIN_EMAIL;

      if (
        process.env.NODE_ENV === 'production' &&
        (adminEmail === undefined || adminEmail === '')
      ) {
        // Throw so the outer catch can handle logging and we still run the finally block to disconnect
        throw new Error(
          'ADMIN_EMAIL environment variable is required in production for seeding.'
        );
      }

      if (adminEmail === undefined || adminEmail === '') {
        // Non-production: warn and fall back to default
        adminEmail = 'admin@ecommerce.com';
        console.warn(
          'WARNING: ADMIN_EMAIL not set; using fallback admin@ecommerce.com for seeding.'
        );
      }

      const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

      const createdAdminUser = await prisma.user.create({
        data: {
          email: adminEmail,
          password: hashedPassword
        }
      });

      await prisma.user.update({
        data: {
          createdBy: createdAdminUser.id,
          updatedBy: createdAdminUser.id
        },
        where: {
          id: createdAdminUser.id
        }
      });
      console.log('✅ First user created.');
    }
  } finally {
    // Ensure Prisma disconnects even on error so the process can exit cleanly
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
