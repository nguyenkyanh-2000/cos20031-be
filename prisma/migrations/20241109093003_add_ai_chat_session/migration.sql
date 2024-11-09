-- CreateEnum
CREATE TYPE "AIChatSessionStatus" AS ENUM ('IN_PROGRESS', 'FINISHED');

-- CreateEnum
CREATE TYPE "HistoryItemRole" AS ENUM ('SYSTEM', 'USER', 'MODEL', 'TOOL');

-- CreateTable
CREATE TABLE "AIChatSession" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "finishedAt" TIMESTAMP(3),
    "metadata" JSONB,
    "status" "AIChatSessionStatus" NOT NULL DEFAULT 'IN_PROGRESS',
    "userId" TEXT NOT NULL,

    CONSTRAINT "AIChatSession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIChatHistoryItem" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "chatSessionId" TEXT NOT NULL,
    "role" "HistoryItemRole" NOT NULL,
    "content" JSONB[],

    CONSTRAINT "AIChatHistoryItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AIChatSession" ADD CONSTRAINT "AIChatSession_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIChatHistoryItem" ADD CONSTRAINT "AIChatHistoryItem_chatSessionId_fkey" FOREIGN KEY ("chatSessionId") REFERENCES "AIChatSession"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
