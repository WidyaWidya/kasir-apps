-- This migration brings the migration history into sync with the existing database schema.
-- It is intended to be marked as applied if the database already contains these changes.

CREATE TYPE "MenuCategory" AS ENUM ('DASHBOARD', 'MASTER', 'TRANSAKSI', 'REPORT');

ALTER TABLE "Menu" ADD COLUMN "category" "MenuCategory" NOT NULL DEFAULT 'MASTER';

ALTER TABLE "Product" ADD COLUMN "discount" DECIMAL(18,2) DEFAULT 0;
