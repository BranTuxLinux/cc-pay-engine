//@ts-ignore
import { PrismaClient } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  await prisma.recharge.deleteMany();
  await prisma.wallet.deleteMany();
  await prisma.user.deleteMany();
  const adminUserId = uuidv4();
  const readOnlyUserId = uuidv4();
  const adminUser = await prisma.user.create({
    data: {
      id: adminUserId,
      email: 'admin@test.com',
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const readOnlyUser = await prisma.user.create({
    data: {
      id: readOnlyUserId,
      email: 'readonly@test.com',
      name: 'Read Only User',
      role: 'READ_ONLY',
    },
  });

  console.log('✅ Usuarios creados:', {
    admin: {
      id: adminUserId,
      email: adminUser.email,
      name: adminUser.name,
      role: adminUser.role,
    },
    readOnly: {
      id: readOnlyUserId,
      email: readOnlyUser.email,
      name: readOnlyUser.name,
      role: readOnlyUser.role,
    },
  });

  console.log('🌱 Seed completado!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

