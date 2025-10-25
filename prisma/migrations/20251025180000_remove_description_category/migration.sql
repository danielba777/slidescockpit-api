-- DropIndex
DROP INDEX "ImageSet_category_idx";

-- AlterTable
ALTER TABLE "ImageSet" DROP COLUMN "description",
DROP COLUMN "category";

