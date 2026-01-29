-- AlterTable
ALTER TABLE "ReadingProgress" ADD COLUMN     "chapterNum" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "chapterId" DROP DEFAULT;
