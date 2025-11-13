require("dotenv").config();
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.appUser.upsert({
    where: { emailLower: "admin@clinic.test" },
    update: {},
    create: {
      email: "admin@clinic.test",
      emailLower: "admin@clinic.test",
      passwordHash: await bcrypt.hash("password123", 12),
      role: "admin",
    },
  });

  const drUser = await prisma.appUser.upsert({
    where: { emailLower: "dr@clinic.test" },
    update: {},
    create: {
      email: "dr@clinic.test",
      emailLower: "dr@clinic.test",
      passwordHash: await bcrypt.hash("password123", 12),
      role: "doctor",
    },
  });
  const doctor = await prisma.doctor.upsert({
    where: { userId: drUser.id },
    update: {},
    create: {
      userId: drUser.id,
      fullName: "Dr. Jane Doe",
      specialty: "General Medicine",
    },
  });

  const patUser = await prisma.appUser.upsert({
    where: { emailLower: "pat@clinic.test" },
    update: {},
    create: {
      email: "pat@clinic.test",
      emailLower: "pat@clinic.test",
      passwordHash: await bcrypt.hash("password123", 12),
      role: "patient",
    },
  });
  const patient = await prisma.patient.upsert({
    where: { userId: patUser.id },
    update: {},
    create: { userId: patUser.id, fullName: "Pat Smith" },
  });

  const now = new Date();
  const start = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  const end = new Date(start.getTime() + 30 * 60 * 1000);

  await prisma.appointment.create({
    data: {
      doctorId: doctor.id,
      patientId: patient.id,
      startsAt: start,
      endsAt: end,
      status: "scheduled",
      reason: "Initial consult",
    },
  });

  console.log("Seeded users:");
  console.log("Admin   admin@clinic.test / password123");
  console.log("Doctor  dr@clinic.test    / password123");
  console.log("Patient pat@clinic.test   / password123");
}
main().finally(() => prisma.$disconnect());
