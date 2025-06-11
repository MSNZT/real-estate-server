import { PrismaClient } from '@prisma/client';
import { AdTypes, PropertyTypes } from '@prisma/client';
import { hash } from "bcrypt"

const prisma = new PrismaClient();

async function main() {
  await prisma.token.deleteMany();
  await prisma.message.deleteMany();
  await prisma.chat.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.favoriteAd.deleteMany();
  await prisma.review.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.propertyDetails.deleteMany();
  await prisma.ad.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.location.deleteMany();
  await prisma.user.deleteMany();

  const hashPassword = await hash(dto.password, 6)

  const ad = await prisma.ad.create({
    data: {
      title: 'Уютная квартира в центре Москвы',
      description: 'Просторная 2-комнатная квартира с ремонтом рядом с метро',
      mainPhoto: "https://avatars.mds.yandex.net/i?id=ce4ea36ba95804bfdf987ccf8d9094fb_l-5318694-images-thumbs&n=13",
      photos: [
        "https://idei.club/uploads/posts/2021-10/1633363428_58-idei-club-p-kvartira-s-remontom-i-mebelyu-interer-kras-60.jpg"
      ],
      adType: "rent_short",
      propertyType: "apartment",
      features: ['wifi', 'tv'],
      location: {
        create: {
          latitude: 55.7558,
          longitude: 37.6176,
          city: 'Москва',
          address: 'ул. Тверская, 10',
        }
      },
      owner: {
        create: {
          email: 'test@mail.ru',
          password: hashPassword,
          name: 'Иван Иванов',
          phone: '+79991234567'
        }
      },
      
      contact: {
        create: {
          name: 'Иван (контактное лицо)',
          email: 'test@mail.ru',
          phone: '+79991234567',
          communication: 'calls-andessages',
        }
      },
      deal: {
        create: {
          price: 8000,
          fields: {
            deposit: 30,
          }
        }
      },
      
      propertyDetails: {
        create: {
          fields: {
            rooms: 2,
            bathroom: "раздельный",
            renovation: "косметический",
            ceilingHeight: 3,
            totalArea: 65,
            livingArea: 35,
            kitchenArea:15,
            floor: 5,
            totalFloor: 9,
            yearBuilt: 2015,
            parkingType: "отсутствует"
          }
        }
      }
    },
  });
  console.log(ad)
}

main()
  .catch((e) => {
    console.error('Ошибка при сидинге:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
