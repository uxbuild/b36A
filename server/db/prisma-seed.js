// Import Prisma Client and Faker.
const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');

// Instantiate Prisma Client
const prisma = new PrismaClient();

async function seed() {
  console.log("Seeding the database.");

  try {
    // Clear the database
    await prisma.student.deleteMany();
    await prisma.instructor.deleteMany();

    // Add 5 instructors
    const instructors = await Promise.all(
      [...Array(5)].map(() =>
        prisma.instructor.create({
          data: {
            username: faker.internet.userName(),
            password: faker.internet.password(),
          },
        })
      )
    );

    // Add 4 students for each instructor
    await Promise.all(
      instructors.map((instructor) =>
        prisma.student.createMany({
          data: [...Array(4)].map(() => ({
            name: faker.person.fullName(),
            cohort: faker.number.int({ min: 2000, max: 3000 }).toString(),
            instructorId: instructor.id,
          })),
        })
      )
    );

    console.log("Database is seeded.");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
}

// Seed the database if we are running this file directly.
if (require.main === module) {
  seed();
}

module.exports = seed;
