/*
  Warnings:

  - You are about to drop the column `email` on the `Supplier` table. All the data in the column will be lost.
  - Added the required column `businessEmail` to the `Supplier` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Supplier" DROP COLUMN "email",
ADD COLUMN     "businessEmail" TEXT NOT NULL;
