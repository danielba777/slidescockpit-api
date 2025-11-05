CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE "UserPostCollection" (
    "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE "UserPostCollection"
    ADD CONSTRAINT "UserPostCollection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "UserPostCollection"
    ADD CONSTRAINT "UserPostCollection_postId_fkey" FOREIGN KEY ("postId") REFERENCES "SlideshowPost"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE UNIQUE INDEX "UserPostCollection_userId_postId_key"
    ON "UserPostCollection"("userId", "postId");

CREATE INDEX "UserPostCollection_postId_idx"
    ON "UserPostCollection"("postId");
