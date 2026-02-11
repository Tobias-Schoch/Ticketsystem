import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('Starting database seed...');

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ticketsystem.de';
  const adminPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  const adminName = process.env.ADMIN_NAME || 'Administrator';

  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existingAdmin) {
    console.log(`Admin user already exists: ${adminEmail}`);
    return;
  }

  // Hash password
  const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      passwordHash,
      name: adminName,
      role: UserRole.admin,
      isActive: true,
    },
  });

  console.log(`Admin user created successfully:`);
  console.log(`  Email: ${admin.email}`);
  console.log(`  Name: ${admin.name}`);
  console.log(`  Role: ${admin.role}`);

  // Create audit log for admin creation
  await prisma.auditLog.create({
    data: {
      action: 'USER_CREATED',
      entityType: 'User',
      entityId: admin.id,
      details: {
        email: admin.email,
        role: admin.role,
        createdBy: 'SYSTEM_SEED',
      },
    },
  });

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
