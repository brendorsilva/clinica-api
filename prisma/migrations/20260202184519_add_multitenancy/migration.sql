/*
  Warnings:

  - Added the required column `clinicId` to the `CashMovement` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `CashMovement` ADD COLUMN `clinicId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `CashMovement` ADD CONSTRAINT `CashMovement_clinicId_fkey` FOREIGN KEY (`clinicId`) REFERENCES `Clinic`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
