/*
  Warnings:

  - You are about to drop the column `receiptFooter` on the `Setting` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Setting" DROP COLUMN "receiptFooter",
ADD COLUMN     "bank1Account" TEXT,
ADD COLUMN     "bank1Name" TEXT,
ADD COLUMN     "bank1Owner" TEXT,
ADD COLUMN     "bank2Account" TEXT,
ADD COLUMN     "bank2Name" TEXT,
ADD COLUMN     "bank2Owner" TEXT,
ADD COLUMN     "cashierName" TEXT,
ADD COLUMN     "discountMethod" TEXT,
ADD COLUMN     "invoiceFooterLine1" TEXT,
ADD COLUMN     "invoiceFooterLine2" TEXT,
ADD COLUMN     "invoiceFooterLine3" TEXT,
ADD COLUMN     "printMethod" TEXT,
ADD COLUMN     "receiptFooterLine1" TEXT,
ADD COLUMN     "receiptFooterLine2" TEXT,
ADD COLUMN     "receiptFooterLine3" TEXT,
ADD COLUMN     "signatureName" TEXT,
ADD COLUMN     "transactionType" TEXT;
