const db = require('../models');
const Okr = db.Okr;
const KeyResult = db.KeyResult;
const Comment = db.Comment;
const User = db.User;
const { sendEmailNotification } = require('../services/emailService')

const getUserEmail = async (userId) => {
    const user = await User.findByPk(userId);
    return user ? user.email : null;
};

// Criar um novo OKR
exports.create = async (req, res) => {
    try {
        const newOkr = await Okr.create({ ...req.body, user_id: req.user.id });
        const userEmail = await getUserEmail(req.user.id);

        if (userEmail) {
            const emailContent = `<p>A OKR <strong>"${newOkr.title}"</strong> foi criada com sucesso.</p>`;
            await sendEmailNotification(
                userEmail,
                `OKR Criada: ${newOkr.title}`,
                emailContent
            );
        }

        res.status(201).json(newOkr);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter todos os OKRs
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
            const userEmail = await getUserEmail(req.user.id);

            if (userEmail) {
                const emailContent = `<p>A OKR <strong>"${updatedOkr.title}"</strong> foi atualizada com sucesso.</p>`;
                await sendEmailNotification(
                    userEmail,
                    `OKR Atualizada: ${updatedOkr.title}`,
                    emailContent
                );
            }
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
        const okrToDelete = await Okr.findByPk(id);
        const deleted = await Okr.destroy({
            where: { id: id }
        });

        if (deleted) {
            const userEmail = await getUserEmail(req.user.id);
            if (userEmail) {
                const emailContent = `<p>A OKR <strong>"${okrToDelete.title}"</strong> foi excluída com sucesso.</p>`;
                await sendEmailNotification(
                    userEmail,
                    `OKR Excluída: ${okrToDelete.title}`,
                    emailContent
                );
            }
            return res.status(204).json({ message: 'OKR deleted' });
        }
        throw new Error('OKR not found');
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};