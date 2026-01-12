import { PrismaClient, Role } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding ...')

  // 1. Create Doctor User
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash('doctor123', salt); // Default password

  const doctorEmail = 'doctor@formatusalud.com';

  // Upsert User
  const doctorUser = await prisma.user.upsert({
    where: { email: doctorEmail },
    update: {},
    create: {
      email: doctorEmail,
      name: 'Dr. Hector',
      role: Role.DOCTOR,
      passwordHash: hash,
      doctorProfile: {
        create: {
          specialty: 'Urology',
          active: true
        }
      }
    },
    include: { doctorProfile: true }
  });

  console.log(`Created/Found Doctor: ${doctorUser.name}`);

  if (!doctorUser.doctorProfile) {
    console.error('Doctor profile missing');
    return;
  }

  // 2. Create slots for next 7 days
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let slotsCount = 0;

  for (let i = 0; i < 7; i++) {
    const day = new Date(today);
    day.setDate(day.getDate() + i);

    // 9:00 to 17:00
    for (let hour = 9; hour < 17; hour++) {
      // Slot 1: 00-30
      const start1 = new Date(day);
      start1.setHours(hour, 0, 0, 0);
      const end1 = new Date(start1);
      end1.setMinutes(30);

      // Slot 2: 30-00
      const start2 = new Date(day);
      start2.setHours(hour, 30, 0, 0);
      const end2 = new Date(start2);
      end2.setMinutes(30);

      const slotsBatch = [
        { start: start1, end: end1 },
        { start: start2, end: end2 }
      ];

      for (const slot of slotsBatch) {
        // Check if exists to avoid dups on multiple seed runs
        const exists = await prisma.availabilitySlot.findFirst({
          where: {
            doctorId: doctorUser.doctorProfile.id,
            startTime: slot.start
          }
        });

        if (!exists) {
          await prisma.availabilitySlot.create({
            data: {
              doctorId: doctorUser.doctorProfile.id,
              startTime: slot.start,
              endTime: slot.end,
              isAvailable: true
            }
          });
          slotsCount++;
        }
      }
    }
  }
  console.log(`Seeded ${slotsCount} availability slots.`);
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
