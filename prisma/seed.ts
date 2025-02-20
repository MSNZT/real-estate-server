import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: [
    { level: "query", emit: "event" },
    { level: "error", emit: "stdout" },
  ],
});

async function main() {
  try {
    await down();
    await up();
  } catch (err) {
    console.log(err);
  }
}

async function up() {
  await prisma.user.create({
    data: {
      email: "user@mail.ru",
      password: "1234",
      name: "Аркадий",
    },
  });
}

//
//   const admin = await prisma.user.create({
//     data: {
//       email: "admin@mail.ru",
//       password: "1234",
//       name: "Роман",
//       roles: "ADMIN",
//     },
//   });
//
//   await prisma.amenity.createMany({
//     data: amenitiesList,
//   });
//
//   for (const loc of locations) {
//     await prisma.location.create({
//       data: loc,
//     });
//   }
//
//   for (let i = 0; i < 20; i++) {
//     await prisma.ad.create({
//       data: {
//         description: descriptions[i],
//         price: 50000 + i * 1000,
//         mainPhoto: photos[i % photos.length],
//         photos,
//         type: i % 2 === 0 ? "LONG_RENT" : "SHORT_RENT",
//         rooms: "2",
//         bathrooms: 1 + (i % 2),
//         area: 45.5 + i,
//         floor: 3 + (i % 5),
//         totalFloors: 10,
//         yearBuilt: 2000 + (i % 20),
//         city: "Москва",
//         street: "Улица Примерная",
//         location: {
//           connect: {
//             id: (i % locations.length) + 1,
//           },
//         },
//         amenities: {
//           connect: amenitiesList.map((_, idx) => ({ id: idx + 1 })),
//         },
//         availableFrom: new Date(),
//         owner: {
//           connect: {
//             id: i % 2 === 0 ? user.id : admin.id,
//           },
//         },
//       },
//     });
//   }
// }
//
// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });
//
async function down() {
  await prisma.$executeRaw`TRUNCATE TABLE "user" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "ad" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "property_details" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "deal" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "booking" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "location" RESTART IDENTITY CASCADE;`;
  await prisma.$executeRaw`TRUNCATE TABLE "review" RESTART IDENTITY CASCADE;`;
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
