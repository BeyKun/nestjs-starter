/*
  Warnings:

  - You are about to drop the column `module` on the `Trash` table. All the data in the column will be lost.
  - Added the required column `moduleId` to the `Trash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trash" DROP COLUMN "module",
ADD COLUMN     "moduleId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Trash" ADD CONSTRAINT "Trash_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
