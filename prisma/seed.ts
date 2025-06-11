import { PrismaClient } from '@prisma/client';
import { AdTypes, PropertyTypes } from '@prisma/client';

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

  const ad = await prisma.ad.create({
    data: {
      title: 'Уютная квартира в центре Москвы',
      description: 'Просторная 2-комнатная квартира с ремонтом рядом с метро',
      mainPhoto: "https://yandex.ru/images/touch/search?text=%D1%84%D0%BE%D1%82%D0%BE+%D0%BA%D0%B2%D0%B0%D1%80%D1%82%D0%B8%D1%80%D1%8B+%D0%B2%D0%BD%D1%83%D1%82%D1%80%D0%B8&pos=9&rpt=simage&img_url=https%3A%2F%2Fgedcdn.gdeetotdom.ru%2Fb%2F3d71c39b3704f7fff811e072e5c36f0b-rb1920x980.jpeg&lr=236",
      photos: [
        "https://yandex.ru/images/touch/search?text=фото+квартиры+внутри&pos=1&rpt=simage&img_url=https%3A%2F%2Fi.pinimg.com%2Foriginals%2F45%2F01%2F8c%2F45018cad5162443578e187229b86afbb.jpg&lr=236"
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
          password: '123456',
          name: 'Иван Иванов',
          phone: '+79991234567'
        }
      },
      
      contact: {
        create: {
          name: 'Иван (контактное лицо)',
          email: 'test@email.ru',
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
