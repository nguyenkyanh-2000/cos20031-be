/*
  Warnings:

  - The `role` column on the `BusinessMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "BusinessMemberRole" AS ENUM ('OWNER', 'MANAGER', 'MEMBER');

-- AlterTable
ALTER TABLE "BusinessMember" DROP COLUMN "role",
ADD COLUMN     "role" "BusinessMemberRole" NOT NULL DEFAULT 'MEMBER';

-- DropEnum
DROP TYPE "BusinessRole";
