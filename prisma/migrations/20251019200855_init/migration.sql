/*
  Warnings:

  - The `scope` column on the `TikTokAccount` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "TikTokAccount" ADD COLUMN     "unionId" TEXT,
DROP COLUMN "scope",
ADD COLUMN     "scope" TEXT[];
