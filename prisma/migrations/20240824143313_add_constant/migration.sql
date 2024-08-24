/*
  Warnings:

  - Added the required column `constant` to the `Module` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Module" ADD COLUMN     "constant" TEXT NOT NULL;
