const db = require('../db/db'); 
const joi = require('joi'); 
const bcrypt = require('bcrypt'); 

const clienteSchema = joi.object({
    cpf: joi.string().length(11).required(), 
    nome: joi.string().required().max(50), 
    endereco: joi.string().required().max(80), 
    bairro: joi.string().required().max(30), 
    cidade: joi.string().required().max(30), 
    cep: joi.string().required(), 
    telefone: joi.string().required(),
    email: joi.string().email().required().max(50), 
    senha: joi.string().min(6).required().max(300),
    dtCadastro: joi.string().required()
})

exports.listarClientes = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM cliente');
        res.json(result); 
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

exports.listarClienteCPF = async (req, res) => {
    const { cpf } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado' });
        }
        res.json(result[0])
    } catch (err) {
        console.error('Erro ao buscar cliente:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

exports.adicionarCliente = async (req, res) => {
    const { cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha, dtCadastro } = req.body;

    
    const { error } = clienteSchema.validate({ cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha, dtCadastro });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
       
        const hash = await bcrypt.hash(senha, 10)
        const novoCliente = { cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha: hash, dtCadastro};
        await db.query('INSERT INTO cliente SET ?', novoCliente);

        res.json({ message: 'Cliente adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(500).json({ error: 'Erro ao adicionar cliente' })
    }
};

exports.atualizarCliente = async (req, res) => {
    const { cpf } = req.params;
    const { nome, endereco, bairro, cidade, cep, telefone, email, senha, dtCadastro } = req.body;
    
    const { error } = clienteSchema.validate({ cpf, nome, endereco, bairro, cidade, cep, telefone, email, senha, dtCadastro });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
    
    const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado'});
        }
    const hash = await bcrypt.hash(senha, 10);   
    const clienteAtualizado = { nome, endereco, bairro, cidade, cep, telefone, email, senha: hash, dtCadastro };
    await db.query('UPDATE cliente SET ? WHERE cpf = ? ', [clienteAtualizado, cpf]);
    res.json({message: 'Cliente atualizado com sucesso'});
    } catch (err) {
    console.error('Erro ao atualizar cliente:', err); 
    res.status(500).json({error: 'Erro ao atualizar'});
    }
};

exports.deletarCliente = async (req, res) => {
    const { cpf } = req.params;
    try {
    
    const [result] = await db.query('SELECT * FROM cliente WHERE cpf = ?', [cpf]);
    if (result.length === 0) {
        return res.status(400).json({ error: 'Cliente não encontrado'});
    }
    await db.query('DELETE FROM cliente WHERE cpf = ?', [cpf]);
    res.json({message: 'Cliente deletado com sucesso'});
    } catch (err) {
        console.error('Erro ao deletar cliente:', err);
        res.status(500).json({error: 'Erro ao deletar cliente'});
    }
};

