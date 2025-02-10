const express = require('express');
const router = express.Router();
const categoriaController = require('../controller/categoriacontroller');

router.get('/categoria', categoriaController.listarCategoria);

router.get('/categoria/:idCategoria', categoriaController.listarCategoriaID);

router.post('/categoria', categoriaController.adicionarCategoria);

router.put('/categoria/:idCategoria', categoriaController.atualizarCategoria);

router.delete('/categoria/:idCategoria', categoriaController.deletarCategoria);

module.exports = router;