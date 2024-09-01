/*
  Warnings:

  - Added the required column `moduleDataId` to the `Trash` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trash" ADD COLUMN     "moduleDataId" TEXT NOT NULL;
