/*
  Warnings:

  - You are about to drop the `LibraryManga` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "LibraryManga" DROP CONSTRAINT "LibraryManga_userId_fkey";

-- DropTable
DROP TABLE "LibraryManga";

-- CreateTable
CREATE TABLE "Library" (
    "userId" TEXT NOT NULL,
    "mangaId" TEXT NOT NULL,

    CONSTRAINT "Library_pkey" PRIMARY KEY ("userId","mangaId")
);

-- AddForeignKey
ALTER TABLE "Library" ADD CONSTRAINT "Library_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
