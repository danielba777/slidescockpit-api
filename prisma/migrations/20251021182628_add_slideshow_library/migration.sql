-- CreateTable
CREATE TABLE "SlideshowAccount" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "profileImageUrl" TEXT,
    "followerCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SlideshowAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideshowPost" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "caption" TEXT,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "commentCount" INTEGER NOT NULL DEFAULT 0,
    "shareCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER,
    "slideCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastSyncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "syncedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlideshowPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlideshowSlide" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "slideIndex" INTEGER NOT NULL,
    "duration" INTEGER,
    "imageUrl" TEXT NOT NULL,
    "textContent" TEXT,
    "backgroundColor" TEXT,
    "textPosition" TEXT,
    "textColor" TEXT,
    "fontSize" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SlideshowSlide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SlideshowAccount_username_key" ON "SlideshowAccount"("username");

-- CreateIndex
CREATE INDEX "SlideshowAccount_username_idx" ON "SlideshowAccount"("username");

-- CreateIndex
CREATE INDEX "SlideshowAccount_isActive_idx" ON "SlideshowAccount"("isActive");

-- CreateIndex
CREATE INDEX "SlideshowAccount_lastSyncedAt_idx" ON "SlideshowAccount"("lastSyncedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SlideshowPost_postId_key" ON "SlideshowPost"("postId");

-- CreateIndex
CREATE INDEX "SlideshowPost_accountId_idx" ON "SlideshowPost"("accountId");

-- CreateIndex
CREATE INDEX "SlideshowPost_postId_idx" ON "SlideshowPost"("postId");

-- CreateIndex
CREATE INDEX "SlideshowPost_isActive_idx" ON "SlideshowPost"("isActive");

-- CreateIndex
CREATE INDEX "SlideshowPost_publishedAt_idx" ON "SlideshowPost"("publishedAt");

-- CreateIndex
CREATE INDEX "SlideshowPost_lastSyncedAt_idx" ON "SlideshowPost"("lastSyncedAt");

-- CreateIndex
CREATE INDEX "SlideshowSlide_postId_idx" ON "SlideshowSlide"("postId");

-- CreateIndex
CREATE INDEX "SlideshowSlide_slideIndex_idx" ON "SlideshowSlide"("slideIndex");

-- CreateIndex
CREATE UNIQUE INDEX "SlideshowSlide_postId_slideIndex_key" ON "SlideshowSlide"("postId", "slideIndex");

-- AddForeignKey
ALTER TABLE "SlideshowPost" ADD CONSTRAINT "SlideshowPost_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "SlideshowAccount"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SlideshowSlide" ADD CONSTRAINT "SlideshowSlide_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SlideshowPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;
