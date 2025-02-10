const db = require('../db/db'); 
const joi = require('joi'); 

const avaliacaoSchema = joi.object({
    nota: joi.string().required().max(5), 
    cometario: joi.string().required().max(100), 
    dtAvaliacao: joi.string().required(), 
    cpf: joi.string().length(11).required(), 
    idPedido: joi.string().required(),
})

exports.listarAvaliacao = async (req, res) => {
    try {
        const [result] = await db.query('SELECT * FROM avaliacao');
        res.json(result); 
    } catch (err) {
        console.error('Erro ao buscar clientes:', err);
        res.status(500).json({ error: 'Erro interno do servidor' })
    }
}

exports.listarAvaliacaoID = async (req, res) => {
    const { idAvaliacao } = req.params;
    try {
        const [result] = await db.query('SELECT * FROM avaliacao WHERE idAvaliacao = ?', [idAvaliacao]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Avaliação não encontrada' });
        }
        res.json(result[0])
    } catch (err) {
        console.error('Erro ao buscar avaliacao:', err);
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
};

exports.adicionarAvaliacao = async (req, res) => {
    const { nota, comentario, dtAvaliacao, cpf, idPedido } = req.body;

    
    const { error } = avaliacaoSchema.validate({ nota, comentario, dtAvaliacao, cpf, idPedido });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
       
        const novaAvaliacao = { nota, comentario, dtAvaliacao, cpf, idPedido};
        await db.query('INSERT INTO avaliacao SET ?', novaAvaliacao);

        res.json({ message: 'Cliente adicionado com sucesso' });
    } catch (err) {
        console.error('Erro ao adicionar cliente:', err);
        res.status(500).json({ error: 'Erro ao adicionar cliente' })
    }
};

exports.atualizarAvaliacao = async (req, res) => {
    const { idAvaliacao } = req.params;
    const { nota, comentario, dtAvaliacao, cpf, idPedido } = req.body;
    
    const { error } = avaliacaoSchema.validate({ nota, comentario, dtAvaliacao, cpf, idPedido });
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    }
    try {
    
    const [result] = await db.query('SELECT * FROM avaliacao WHERE idAvaliacao = ?', [idAvaliacao]);
        if (result.length === 0) {
            return res.status(404).json({ error: 'Avaliação não encontrado'});
        }  
    const avaliacaoAtualizada = { nota, comentario, dtAvaliacao, cpf, idPedido  };
    await db.query('UPDATE avaliacao SET ? WHERE idAvaliacao = ? ', [avaliacaoAtualizada, idAvaliacao]);
    res.json({message: 'Avaliação atualizada com sucesso'});
    } catch (err) {
    console.error('Erro ao atualizar avaliação:', err); 
    res.status(500).json({error: 'Erro ao atualizar'});
    }
};

exports.deletarAvaliacao = async (req, res) => {
    const { idAvaliacao } = req.params;
    try {
    
    const [result] = await db.query('SELECT * FROM avaliacao WHERE avaliacao = ?', [idAvaliacao]);
    if (result.length === 0) {
        return res.status(400).json({ error: 'Avaliação não encontrado'});
    }
    await db.query('DELETE FROM avaliacao WHERE idAvaliacao = ?', [idAvaliacao]);
    res.json({message: 'Avaliação deletada com sucesso'});
    } catch (err) {
        console.error('Erro ao deletar avaliação:', err);
        res.status(500).json({error: 'Erro ao deletar avaliação'});
    }
};

