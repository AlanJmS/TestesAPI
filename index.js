const express = require("express");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const app = express();
app.use(express.json());
const PORT = 4000;

const validarTipo = (tipo, res) => {
  if (!["categorias", "pagamentos", "despesas"].includes(tipo)) {
    res.status(400).send("Tipo inválido. Use 'categorias', 'pagamentos' ou 'despesas'.");
    return false;
  }
  return true;
};

app.get("/:tipo/:id?", async (req, res) => {
  const { tipo, id } = req.params;
  if (!validarTipo(tipo, res)) return;

  try {
    if (id) {
      const item = await prisma[tipo].findUnique({ where: { id: Number(id) } });
      return item ? res.json(item) : res.status(404).send("Não encontrado.");
    }
    const itens = await prisma[tipo].findMany();
    res.json(itens);
  } catch (error) {
    res.status(500).send("Erro no servidor.");
  }
});

app.post("/:tipo", async (req, res) => {
  const { tipo } = req.params;
  const novoItem = req.body;
  if (!validarTipo(tipo, res)) return;

  try {
    const itemCriado = await prisma[tipo].create({ data: novoItem });
    res.status(201).json(itemCriado);
  } catch (error) {
    res.status(500).send("Erro ao criar item.");
  }
});

app.put("/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  const dadosAtualizados = req.body;
  if (!validarTipo(tipo, res)) return;

  try {
    const itemAtualizado = await prisma[tipo].update({
      where: { id: Number(id) },
      data: dadosAtualizados,
    });
    res.json(itemAtualizado);
  } catch (error) {
    res.status(404).send("Item não encontrado.");
  }
});

app.delete("/:tipo/:id", async (req, res) => {
  const { tipo, id } = req.params;
  if (!validarTipo(tipo, res)) return;

  try {
    const itemRemovido = await prisma[tipo].delete({
      where: { id: Number(id) },
    });
    res.json({ message: "Item removido com sucesso.", item: itemRemovido });
  } catch (error) {
    res.status(404).send("Item não encontrado.");
  }
});

app.listen(PORT, () => {
  console.log(`O server está rodando em http://localhost:${PORT}`);
});