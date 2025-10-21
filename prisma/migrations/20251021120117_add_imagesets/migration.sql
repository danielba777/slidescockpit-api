-- CreateTable
CREATE TABLE "ImageSet" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImageSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ImageSetImage" (
    "id" TEXT NOT NULL,
    "imageSetId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "metadata" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImageSetImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ImageSet_slug_key" ON "ImageSet"("slug");

-- CreateIndex
CREATE INDEX "ImageSet_slug_idx" ON "ImageSet"("slug");

-- CreateIndex
CREATE INDEX "ImageSet_category_idx" ON "ImageSet"("category");

-- CreateIndex
CREATE INDEX "ImageSet_isActive_idx" ON "ImageSet"("isActive");

-- CreateIndex
CREATE INDEX "ImageSetImage_imageSetId_idx" ON "ImageSetImage"("imageSetId");

-- CreateIndex
CREATE INDEX "ImageSetImage_order_idx" ON "ImageSetImage"("order");

-- AddForeignKey
ALTER TABLE "ImageSetImage" ADD CONSTRAINT "ImageSetImage_imageSetId_fkey" FOREIGN KEY ("imageSetId") REFERENCES "ImageSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;
