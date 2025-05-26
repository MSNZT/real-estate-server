-- AlterTable
ALTER TABLE "user" ADD COLUMN     "resetPasswordCode" TEXT,
ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "token_created_at_idx" ON "token"("created_at");

-- CreateIndex
CREATE INDEX "token_used_idx" ON "token"("used");
