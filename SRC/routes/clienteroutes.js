const express = require('express');
const router = express.Router(); 
const clienteController = require('../controller/clientecontroller'); 


router.get('/clientes', clienteController.listarClientes);

router.get('/clientes/:cpf', clienteController.listarClienteCPF);

router.post('/clientes', clienteController.adicionarCliente);

router.put('/clientes/:cpf', clienteController.atualizarCliente);

router.delete('/clientes/:cpf', clienteController.deletarCliente);

module.exports = router;
