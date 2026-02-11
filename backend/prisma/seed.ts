import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SALT_ROUNDS = 12;

async function main() {
  console.log('Starting database seed...');

  // Create Administrator (super admin, hidden from team list)
  const administratorEmail = 'administrator@ticketsystem.de';
  const administratorPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';

  const existingAdministrator = await prisma.user.findUnique({
    where: { email: administratorEmail },
  });

  if (!existingAdministrator) {
    const passwordHash = await bcrypt.hash(administratorPassword, SALT_ROUNDS);

    const administrator = await prisma.user.create({
      data: {
        email: administratorEmail,
        passwordHash,
        name: 'Administrator',
        role: UserRole.administrator,
        isActive: true,
      },
    });

    console.log(`Administrator created:`);
    console.log(`  Email: ${administrator.email}`);
    console.log(`  Role: ${administrator.role}`);

    await prisma.auditLog.create({
      data: {
        action: 'USER_CREATED',
        entityType: 'User',
        entityId: administrator.id,
        details: {
          email: administrator.email,
          role: administrator.role,
          createdBy: 'SYSTEM_SEED',
        },
      },
    });
  } else {
    console.log(`Administrator already exists: ${administratorEmail}`);
  }

  // Create Team-Lead
  const teamLeadEmail = process.env.ADMIN_EMAIL || 'admin@ticketsystem.de';
  const teamLeadPassword = process.env.ADMIN_PASSWORD || 'ChangeThisPassword123!';
  const teamLeadName = process.env.ADMIN_NAME || 'Team-Lead';

  const existingTeamLead = await prisma.user.findUnique({
    where: { email: teamLeadEmail },
  });

  if (!existingTeamLead) {
    const passwordHash = await bcrypt.hash(teamLeadPassword, SALT_ROUNDS);

    const teamLead = await prisma.user.create({
      data: {
        email: teamLeadEmail,
        passwordHash,
        name: teamLeadName,
        role: UserRole.teamLead,
        isActive: true,
      },
    });

    console.log(`Team-Lead created:`);
    console.log(`  Email: ${teamLead.email}`);
    console.log(`  Name: ${teamLead.name}`);
    console.log(`  Role: ${teamLead.role}`);

    await prisma.auditLog.create({
      data: {
        action: 'USER_CREATED',
        entityType: 'User',
        entityId: teamLead.id,
        details: {
          email: teamLead.email,
          role: teamLead.role,
          createdBy: 'SYSTEM_SEED',
        },
      },
    });
  } else {
    console.log(`Team-Lead already exists: ${teamLeadEmail}`);
  }

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
