/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Despesa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Despesa" DROP CONSTRAINT "Despesa_categoriaId_fkey";

-- DropTable
DROP TABLE "Categoria";

-- DropTable
DROP TABLE "Despesa";

-- DropTable
DROP TABLE "Pagamento";

-- CreateTable
CREATE TABLE "Categorias" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Categorias_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pagamentos" (
    "id" SERIAL NOT NULL,
    "tipo" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,

    CONSTRAINT "Pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Despesas" (
    "id" SERIAL NOT NULL,
    "descricao" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "categoriaId" INTEGER NOT NULL,

    CONSTRAINT "Despesas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Despesas" ADD CONSTRAINT "Despesas_categoriaId_fkey" FOREIGN KEY ("categoriaId") REFERENCES "Categorias"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
