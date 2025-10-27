-- CreateEnum
CREATE TYPE "AiAvatarGenerationJobStatus" AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- CreateTable
CREATE TABLE "AiAvatarGenerationJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "expectedImages" INTEGER NOT NULL DEFAULT 4,
    "status" "AiAvatarGenerationJobStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiAvatarGenerationJob_pkey" PRIMARY KEY ("id")
);

-- AlterTable
ALTER TABLE "AiAvatarGeneration"
ADD COLUMN "jobId" TEXT;

-- AddForeignKey
ALTER TABLE "AiAvatarGeneration"
ADD CONSTRAINT "AiAvatarGeneration_jobId_fkey"
FOREIGN KEY ("jobId") REFERENCES "AiAvatarGenerationJob"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "AiAvatarGenerationJob"
ADD CONSTRAINT "AiAvatarGenerationJob_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "AiAvatarGeneration_jobId_idx" ON "AiAvatarGeneration"("jobId");
CREATE INDEX "AiAvatarGenerationJob_userId_idx" ON "AiAvatarGenerationJob"("userId");
CREATE INDEX "AiAvatarGenerationJob_status_idx" ON "AiAvatarGenerationJob"("status");
CREATE INDEX "AiAvatarGenerationJob_startedAt_idx" ON "AiAvatarGenerationJob"("startedAt");
