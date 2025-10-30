-- CreateTable
CREATE TABLE "AiAvatarGeneration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "rawImageUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiAvatarGeneration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiAvatarGeneration_userId_idx" ON "AiAvatarGeneration"("userId");
CREATE INDEX "AiAvatarGeneration_createdAt_idx" ON "AiAvatarGeneration"("createdAt");

-- AddForeignKey
ALTER TABLE "AiAvatarGeneration"
ADD CONSTRAINT "AiAvatarGeneration_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

