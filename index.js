const express = require("express");
const app = express();
app.use(express.json());
const PORT = 4000;

const categorias = require("./src/data/categorias.json");
const despesas = require("./src/data/despesas.json");
const pagamentos = require("./src/data/pagamentos.json");

const dataMap = { categorias, pagamentos, despesas };

const regrasValidacao = {
  categorias: ["nome", "descricao"],
  pagamentos: ["tipo", "descricao"],
  despesas: ["descricao", "valor", "categoria"]
};

const validarTipo = (tipo, res) => {
  if (!dataMap[tipo]) {
    res.status(400).send("Tipo inválido. Use 'categorias', 'pagamentos' ou 'despesas'.");
    return false;
  }
  return true;
};

const buscarItem = (data, id) => data.find(item => item.id === Number(id));

const validarCampos = (tipo, item, res) => {
  const camposFaltando = regrasValidacao[tipo].filter(campo => !item[campo]);
  if (camposFaltando.length > 0) {
    res.status(400).send(`Campos obrigatórios ausentes: ${camposFaltando.join(", ")}`);
    return false;
  }
  return true;
};

const gerarNovoId = (data) => data.length ? Math.max(...data.map(i => i.id)) + 1 : 1;

app.get("/:tipo/:id?", (req, res) => {
  const { tipo, id } = req.params;
  if (!validarTipo(tipo, res)) return;

  if (id) {
    const item = buscarItem(dataMap[tipo], id);
    return item ? res.json(item) : res.status(404).send(`${tipo.slice(0, -1)} não encontrado(a).`);
  }

  res.json(dataMap[tipo]);
});

app.post("/:tipo", (req, res) => {
  const { tipo } = req.params;
  const novoItem = req.body;
  if (!validarTipo(tipo, res) || !validarCampos(tipo, novoItem, res)) return;

  novoItem.id = novoItem.id || gerarNovoId(dataMap[tipo]);

  if (buscarItem(dataMap[tipo], novoItem.id)) {
    return res.status(400).send("Já existe um item com esse ID.");
  }

  dataMap[tipo].push(novoItem);
  res.status(201).json(novoItem);
});

app.put("/:tipo/:id", (req, res) => {
  const { tipo, id } = req.params;
  const itemAtualizado = req.body;
  if (!validarTipo(tipo, res)) return;

  const data = dataMap[tipo];
  const itemIndex = data.findIndex(i => i.id === Number(id));
  if (itemIndex === -1) return res.status(404).send("Item não encontrado.");

  if (!validarCampos(tipo, itemAtualizado, res)) return;

  if (itemAtualizado.id && itemAtualizado.id !== Number(id)) {
    return res.status(400).send("O ID no corpo deve ser o mesmo da URL.");
  }

  data[itemIndex] = { ...data[itemIndex], ...itemAtualizado };
  res.json(data[itemIndex]);
});

app.delete("/:tipo/:id", (req, res) => {
  const { tipo, id } = req.params;
  if (!validarTipo(tipo, res)) return;

  const data = dataMap[tipo];
  const itemIndex = data.findIndex(i => i.id === Number(id));
  if (itemIndex === -1) return res.status(404).send("Item não encontrado.");

  const itemRemovido = data.splice(itemIndex, 1)[0];
  res.json({ message: "Item removido com sucesso.", item: itemRemovido });
});

app.listen(PORT, () => {
  console.log(`O server está rodando em http://localhost:${PORT}`);
});