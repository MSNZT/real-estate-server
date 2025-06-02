-- DropForeignKey
ALTER TABLE "ad" DROP CONSTRAINT "ad_ownerId_fkey";

-- CreateTable
CREATE TABLE "favorite_ad" (
    "id" TEXT NOT NULL,
    "adId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "favorite_ad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "favorite_ad_adId_idx" ON "favorite_ad"("adId");

-- CreateIndex
CREATE INDEX "favorite_ad_userId_idx" ON "favorite_ad"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorite_ad_adId_userId_key" ON "favorite_ad"("adId", "userId");

-- CreateIndex
CREATE INDEX "ad_adType_idx" ON "ad"("adType");

-- CreateIndex
CREATE INDEX "ad_propertyType_idx" ON "ad"("propertyType");

-- CreateIndex
CREATE INDEX "ad_features_idx" ON "ad"("features");

-- AddForeignKey
ALTER TABLE "ad" ADD CONSTRAINT "ad_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_ad" ADD CONSTRAINT "favorite_ad_adId_fkey" FOREIGN KEY ("adId") REFERENCES "ad"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorite_ad" ADD CONSTRAINT "favorite_ad_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
