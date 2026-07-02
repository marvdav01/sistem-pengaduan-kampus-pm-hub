import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkDatabase() {
  console.log('--- PENGECEKAN ISI DATABASE ---');
  
  const units = await prisma.unit.findMany();
  console.log(`\nJumlah Unit Layanan: ${units.length}`);
  units.forEach(u => console.log(` - ID: ${u.id}, Nama: ${u.name}`));
  
  const categories = await prisma.category.findMany();
  console.log(`\nJumlah Kategori Pengaduan: ${categories.length}`);
  categories.forEach(c => console.log(` - ID: ${c.id}, Nama: ${c.name}`));
  
  const users = await prisma.user.findMany();
  console.log(`\nJumlah Akun User: ${users.length}`);
  users.forEach(u => console.log(` - ID: ${u.id}, Nama: ${u.name}, Email: ${u.email}, Role: ${u.role}`));
}

checkDatabase()
  .catch(console.error)
  .finally(async () => {
    await prisma.$disconnect();
  });
