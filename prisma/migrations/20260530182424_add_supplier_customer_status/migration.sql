-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "PaymentMethod" ALTER COLUMN "type" SET DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "Supplier" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;
