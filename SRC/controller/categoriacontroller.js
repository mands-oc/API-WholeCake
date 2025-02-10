const db = require('../db/db');
const joi = require('joi');

const categoriaSchema = joi.object({
    idCategoria: joi.string().required(),
    nomeCategoria: joi.string().required().max(50),
})

exports.listarCategoria = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM categoria');
        res.json(result);
    } catch (err) {
        console.error('Erro ao buscar categoria:', err);
        res.status(500).json({error: 'Erro interno do servidor'})
    }
};

exports.listarCategoriaID= async (req, res) => {
    const { idCategoria } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM categoria WHERE idCategoria = ?', [idCategoria]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrado'})
        }
        res.json(result[0])
    } catch (err) {
        console.error('Erro ao buscar categoria:', err);
        res.status(500).json({ error: 'Erro interno do servidor'})
    }
};

exports.buscarCategoriaNome = async (req, res) => {
    const { nomeCategoria } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM categoria WHERE nomeCategoria LIKE ?', [`${nomeCategoria}%`]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrado' });
        }
        res.json(result);
    } catch (err) {
        console.error('Erro ao buscar categoria:', err);
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
};

exports.adicionarCategoria = async (req, res) => {
    const { idCategoria, nomeCategoria } = req.body;
    const { error } = categoriaSchema.validate({ idCategoria, nomeCategoria });
    if (error) {
        return res.status(400).json({ error: error.details[0].message })
    }
    try {
        const novaCategoria = { idCategoria, nomeCategoria};
        await db.query('INSERT INTO categoria SET ?', novaCategoria);
        res.json({ message: 'Categoria adicionada com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar categoria: ', err)
        res.status(500).json({ error: 'Erro ao adicionar categoria' })
    }
};

exports.atualizarCategoria = async (req, res) => {
    const { idCategoria } = req.params;
    const { nomeCategoria } = req.body;
    const { error } = categoriaSchema.validate({ idCategoria, nomeCategoria });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
        const [result] = await db.query('SELECT * FROM categoria WHERE idCategoria = ?', [idCategoria]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Categoria não encontrado' });
        }
        const categoriaAtualizada = { nomeCategoria, idCategoria };
        await db.query('UPDATE categoria SET ? WHERE idCategoria = ? ', [categoriaAtualizada, idCategoria]);
        res.json({ message: 'Categoria atualizada com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar categoria:', err);
        res.status(500).json({ error: 'Erro ao atualizar' });
    }
};

exports.deletarCategoria = async (req, res) => {
    const { idCategoria } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM categoria WHERE idCategoria = ?', [idCategoria]);
        if (result.length === 0) {
            return res.status(400).json({ error: 'Categoria não encontrada' });
        }
        await db.query('DELETE FROM categoria WHERE idCategoria = ?', [idCategoria]);
        res.json({ message: 'Categoria deletada com sucesso' });
    } catch (err) {
        console.error('Erro ao deletar Categoria:', err)
        res.status(500).json({ error: 'Erro ao deletar categoria' });
    }
};