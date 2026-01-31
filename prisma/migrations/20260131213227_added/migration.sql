/*
  Warnings:

  - The primary key for the `ReadingProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `chapterId` to the `ReadingProgress` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReadingProgress" DROP CONSTRAINT "ReadingProgress_pkey",
ADD COLUMN     "chapterId" TEXT NOT NULL,
ADD CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("userId", "mangaId", "chapterId");
