-- AlterTable
ALTER TABLE "Client" ADD COLUMN     "lastDeskId" INTEGER;

-- AddForeignKey
ALTER TABLE "Client" ADD CONSTRAINT "Client_lastDeskId_fkey" FOREIGN KEY ("lastDeskId") REFERENCES "Desk"("id") ON DELETE SET NULL ON UPDATE CASCADE;
