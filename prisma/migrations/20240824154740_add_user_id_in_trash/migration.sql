/*
  Warnings:

  - Added the required column `userId` to the `Trash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trash" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Trash" ADD CONSTRAINT "Trash_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
