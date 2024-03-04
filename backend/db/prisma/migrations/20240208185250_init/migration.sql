-- DropForeignKey
ALTER TABLE "Desk" DROP CONSTRAINT "Desk_clientId_fkey";

-- AlterTable
ALTER TABLE "Desk" ALTER COLUMN "clientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Desk" ADD CONSTRAINT "Desk_clientId_fkey" FOREIGN KEY ("clientId") REFERENCES "Client"("id") ON DELETE SET NULL ON UPDATE CASCADE;
