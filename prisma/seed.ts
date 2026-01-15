import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Define Doctors Data
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('formatusalud123', salt); // Standard secure password

  const doctorsData = [
    {
      name: "Kilder García Murga",
      email: "kilder.garcia@formatusalud.com",
      specialty: "Urología"
    },
    {
      name: "Laura Romero",
      email: "laura.romero@formatusalud.com",
      specialty: "Dermatología"
    },
    {
      name: "Juan Carlos Valverde",
      email: "juan.valverde@formatusalud.com",
      specialty: "Coloproctología y Cirugía General"
    }
  ];

  for (const doc of doctorsData) {
    // Upsert User
    const user = await prisma.user.upsert({
      where: { email: doc.email },
      update: {},
      create: {
        email: doc.email,
        name: doc.name,
        role: Role.DOCTOR,
        passwordHash: passwordHash,
        doctorProfile: {
          create: {
            specialty: doc.specialty, // Spanish specialty
            active: true
          }
        }
      },
      include: { doctorProfile: true }
    });

    console.log(`Synced Doctor: ${user.name} (${doc.specialty})`);

    if (!user.doctorProfile) continue;

    // 2. Create slots for next 7 days for each doctor
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let slotsCreated = 0;

    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(day.getDate() + i);

      // 9:00 to 17:00
      for (let hour = 9; hour < 17; hour++) {
        const start = new Date(day);
        start.setHours(hour, 0, 0, 0);
        const end = new Date(start);
        end.setMinutes(30);

        // Check availability to avoid duplicates
        const exists = await prisma.availabilitySlot.findFirst({
          where: {
            doctorId: user.doctorProfile.id,
            startTime: start
          }
        });

        if (!exists) {
          await prisma.availabilitySlot.create({
            data: {
              doctorId: user.doctorProfile.id,
              startTime: start,
              endTime: end,
              isAvailable: true
            }
          });
          slotsCreated++;
        }
      }
    }
    console.log(`  - Slots managed for ${user.name}: +${slotsCreated} new`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
