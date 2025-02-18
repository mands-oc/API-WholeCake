const express = require('express')
const router = express.Router();
const produtoController = require('../controller/produtocontroller');

router.get('/produtos', produtoController.listarProdutos);

router.get('/produtos/:idProduto', produtoController.listarProdutoID);

router.get('/produtos/nome/:nomeProduto', produtoController.buscarProdutoNome);

router.post('/produtos', produtoController.adicionarProduto);

router.put('/produtos/:idProduto', produtoController.atualizarProduto);

router.delete('/produtos/:idProduto', produtoController.deletarProduto)

module.exports = router;