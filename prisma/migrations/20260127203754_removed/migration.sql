/*
  Warnings:

  - The primary key for the `LibraryManga` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ReadingProgress` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "LibraryManga" DROP CONSTRAINT "LibraryManga_pkey",
ADD CONSTRAINT "LibraryManga_pkey" PRIMARY KEY ("userId");

-- AlterTable
ALTER TABLE "ReadingProgress" DROP CONSTRAINT "ReadingProgress_pkey",
ADD CONSTRAINT "ReadingProgress_pkey" PRIMARY KEY ("userId");
