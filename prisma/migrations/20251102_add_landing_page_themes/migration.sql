-- CreateTable
CREATE TABLE "LandingPageTheme" (
    "id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL,
    "heroSubtitle" TEXT,
    "description" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LandingPageTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LandingPageTheme_category_key" ON "LandingPageTheme"("category");

-- CreateIndex
CREATE INDEX "LandingPageTheme_category_idx" ON "LandingPageTheme"("category");

-- CreateIndex
CREATE INDEX "LandingPageTheme_isActive_idx" ON "LandingPageTheme"("isActive");

