-- CreateTable
CREATE TABLE "AiAvatarTemplate" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageKey" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AiAvatarTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AiAvatarTemplate_slug_key" ON "AiAvatarTemplate"("slug");

-- CreateIndex
CREATE INDEX "AiAvatarTemplate_isActive_idx" ON "AiAvatarTemplate"("isActive");

-- CreateIndex
CREATE INDEX "AiAvatarTemplate_createdAt_idx" ON "AiAvatarTemplate"("createdAt");
