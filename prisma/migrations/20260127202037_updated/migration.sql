/*
  Warnings:

  - The primary key for the `LibraryManga` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `externalMangaId` on the `LibraryManga` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `LibraryManga` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `LibraryManga` table. All the data in the column will be lost.
  - The primary key for the `ReadingProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `externalChapterId` on the `ReadingProgress` table. All the data in the column will be lost.
  - You are about to drop the column `externalMangaId` on the `ReadingProgress` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `ReadingProgress` table. All the data in the column will be lost.
  - You are about to drop the column `lastPage` on the `ReadingProgress` table. All the data in the column will be lost.
  - You are about to drop the column `sourceId` on the `ReadingProgress` table. All the data in the column will be lost.
  - You are about to drop the `Source` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserSource` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mangaId` to the `LibraryManga` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mangaId` to the `ReadingProgress` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "LibraryManga" DROP CONSTRAINT "LibraryManga_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "ReadingProgress" DROP CONSTRAINT "ReadingProgress_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "UserSource" DROP CONSTRAINT "UserSource_sourceId_fkey";

-- DropForeignKey
ALTER TABLE "UserSource" DROP CONSTRAINT "UserSource_userId_fkey";

-- DropIndex
DROP INDEX "LibraryManga_userId_sourceId_externalMangaId_key";

-- DropIndex
DROP INDEX "ReadingProgress_userId_sourceId_externalMangaId_externalCha_key";

-- AlterTable
ALTER TABLE "LibraryManga" DROP CONSTRAINT "LibraryManga_pkey",
DROP COLUMN "externalMangaId",
DROP COLUMN "id",
DROP COLUMN "sourceId",
ADD COLUMN     "mangaId" TEXT NOT NULL,
ADD CONSTRAINT "LibraryManga_pkey" PRIMARY KEY ("userId", "mangaId");

-- AlterTable
ALTER TABLE "ReadingProgress" DROP CONSTRAINT "ReadingProgress_pkey",
DROP COLUMN "externalChapterId",
DROP COLUMN "externalMangaId",
DROP COLUMN "id",
DROP COLUMN "lastPage",
DROP COLUMN "sourceId",
ADD COLUMN     "chapterId" TEXT NOT NULL DEFAULT '1',
ADD COLUMN     "mangaId" TEXT NOT NULL,
ADD CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("userId", "mangaId");

-- DropTable
DROP TABLE "Source";

-- DropTable
DROP TABLE "UserSource";
