const db = require('../models');
const Okr = db.Okr;
const KeyResult = db.KeyResult;
const Comment = db.Comment;

// Criar um novo OKR
exports.create = async (req, res) => {
    try {
        const newOkr = await Okr.create(req.body);
        res.status(201).json(newOkr);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter todos os OKRs, incluindo seus Key Results
exports.findAll = async (req, res) => {
    try {
        const okrs = await Okr.findAll({
            include: [{
                model: KeyResult,
                as: 'keyResults'
            },
            {
                model: Comment,
                as: 'comments'
            }
            ]
        });
        if (!okrs || okrs.length === 0) {
            return res.status(404).json({ message: 'OKRs not found' });
        }
        res.status(200).json(okrs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter um OKR por ID
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const okr = await Okr.findByPk(id, {
            include: [
                {
                    model: KeyResult,
                    as: 'keyResults'
                },
                {
                    model: Comment,
                    as: 'comments'
                }
            ]
        });
        if (!okr) {
            return res.status(404).json({ message: 'OKR not found' });
        }
        res.status(200).json(okr);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar um OKR
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await Okr.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updatedOkr = await Okr.findByPk(id);
            return res.status(200).json(updatedOkr);
        }
        throw new Error('OKR not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Excluir um OKR
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Okr.destroy({
            where: { id: id }
        });
        if (deleted) {
            return res.status(204).json({ message: 'OKR deleted' });
        }
        throw new Error('OKR not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};