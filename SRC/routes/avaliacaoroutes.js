const express = require('express');
const router = express.Router(); 
const avaliacaoController = require('../controller/avaliacaocontroller'); 


router.get('/avaliacao', avaliacaoController.listarAvaliacao);

router.get('/avaliacao/:idAvaliacao', avaliacaoController.listarAvaliacaoID);

router.post('/avaliacao', avaliacaoController.adicionarAvaliacao);

router.put('/avaliacao/:idAvaliacao', avaliacaoController.atualizarAvaliacao);

router.delete('/avaliacao/:idAvaliacao', avaliacaoController.deletarAvaliacao);

module.exports = router;