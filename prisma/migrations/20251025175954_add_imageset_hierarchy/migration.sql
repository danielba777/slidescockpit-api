-- AlterTable
ALTER TABLE "ImageSet" ADD COLUMN "parentId" TEXT;

-- CreateIndex
CREATE INDEX "ImageSet_parentId_idx" ON "ImageSet"("parentId");

-- AddForeignKey
ALTER TABLE "ImageSet" ADD CONSTRAINT "ImageSet_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "ImageSet"("id") ON DELETE CASCADE ON UPDATE CASCADE;

