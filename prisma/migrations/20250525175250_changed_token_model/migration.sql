/*
  Warnings:

  - You are about to drop the column `token` on the `token` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jit]` on the table `token` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jit` to the `token` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "token_token_key";

-- AlterTable
ALTER TABLE "token" DROP COLUMN "token",
ADD COLUMN     "jit" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "token_jit_key" ON "token"("jit");
