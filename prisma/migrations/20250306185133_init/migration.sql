/*
  Warnings:

  - You are about to drop the column `categoriaId` on the `Despesas` table. All the data in the column will be lost.
  - Added the required column `metodo_pagamento` to the `Despesas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Despesas" DROP CONSTRAINT "Despesas_categoriaId_fkey";

-- AlterTable
ALTER TABLE "Despesas" DROP COLUMN "categoriaId",
ADD COLUMN     "metodo_pagamento" TEXT NOT NULL;
