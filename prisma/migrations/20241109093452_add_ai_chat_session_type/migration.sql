/*
  Warnings:

  - Added the required column `type` to the `AIChatSession` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AIChatSessionType" AS ENUM ('CUSTOMER_SERVICE');

-- AlterTable
ALTER TABLE "AIChatSession" ADD COLUMN     "type" "AIChatSessionType" NOT NULL;
