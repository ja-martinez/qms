/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `Desk` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `number` to the `Desk` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Desk" ADD COLUMN     "number" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Desk_number_key" ON "Desk"("number");
