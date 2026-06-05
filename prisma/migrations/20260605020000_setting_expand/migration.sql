-- Add new Setting fields and rename old ones

-- Drop old columns
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "bank1Account";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "bank1Owner";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "bank2Account";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "bank2Owner";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "defaultDiscount";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "invoiceFooterLine1";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "invoiceFooterLine2";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "invoiceFooterLine3";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "receiptFooterLine1";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "receiptFooterLine2";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "receiptFooterLine3";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "signatureName";
ALTER TABLE "Setting" DROP COLUMN IF EXISTS "receiptFooter";

-- Add missing columns with proper types
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "cashierName" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "discountMethod" TEXT NOT NULL DEFAULT 'Persen';
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "transactionType" TEXT NOT NULL DEFAULT 'Invoice';
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "printMethod" TEXT NOT NULL DEFAULT 'Export ke PDF';
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "bank1Name" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "bank1AccountNumber" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "bank1AccountName" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "bank2Name" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "bank2AccountNumber" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "bank2AccountName" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "receiptFooter1" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "receiptFooter2" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "receiptFooter3" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "invoiceFooter1" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "invoiceFooter2" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "invoiceFooter3" TEXT;
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "regards" TEXT;

-- Ensure defaultTax column is present and has correct type/default
ALTER TABLE "Setting" ADD COLUMN IF NOT EXISTS "defaultTax" DECIMAL(5,2) NOT NULL DEFAULT 0;

-- Ensure storeName has default value
ALTER TABLE "Setting" ALTER COLUMN "storeName" SET DEFAULT 'Toko Saya';
