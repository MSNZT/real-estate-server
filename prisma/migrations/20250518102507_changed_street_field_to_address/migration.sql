/*
  Warnings:

  - The values [rent] on the enum `AdTypes` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `durationRent` on the `deal` table. All the data in the column will be lost.
  - You are about to drop the column `street` on the `location` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[latitude,longitude,city,address]` on the table `location` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contactId` to the `ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestCounts` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestName` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `guestPhone` to the `booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `location` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "AdTypes_new" AS ENUM ('rent_short', 'rent_long', 'sell');
ALTER TABLE "ad" ALTER COLUMN "adType" TYPE "AdTypes_new" USING ("adType"::text::"AdTypes_new");
ALTER TYPE "AdTypes" RENAME TO "AdTypes_old";
ALTER TYPE "AdTypes_new" RENAME TO "AdTypes";
DROP TYPE "AdTypes_old";
COMMIT;

-- DropIndex
DROP INDEX "location_latitude_longitude_city_street_key";

-- AlterTable
ALTER TABLE "ad" ADD COLUMN     "contactId" TEXT NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "views" INTEGER DEFAULT 0;

-- AlterTable
ALTER TABLE "booking" ADD COLUMN     "guestCounts" INTEGER NOT NULL,
ADD COLUMN     "guestName" TEXT NOT NULL,
ADD COLUMN     "guestPhone" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "deal" DROP COLUMN "durationRent";

-- AlterTable
ALTER TABLE "location" DROP COLUMN "street",
ADD COLUMN     "address" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "phone" TEXT NOT NULL;

-- DropEnum
DROP TYPE "DurationRentTypes";

-- CreateTable
CREATE TABLE "contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "communication" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "location_latitude_longitude_idx" ON "location"("latitude", "longitude");

-- CreateIndex
CREATE UNIQUE INDEX "location_latitude_longitude_city_address_key" ON "location"("latitude", "longitude", "city", "address");

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
