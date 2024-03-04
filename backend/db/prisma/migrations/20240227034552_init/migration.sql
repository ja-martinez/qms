/*
  Warnings:

  - You are about to drop the column `code` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the `Role` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name_es]` on the table `Department` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_es` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_roleId_fkey";

-- DropIndex
DROP INDEX "Department_code_key";

-- AlterTable
ALTER TABLE "Department" DROP COLUMN "code",
ADD COLUMN     "name_es" TEXT NOT NULL;

-- DropTable
DROP TABLE "Role";

-- DropTable
DROP TABLE "User";

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_es_key" ON "Department"("name_es");
