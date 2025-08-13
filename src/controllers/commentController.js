const db = require('../models');
const Okr = db.Okr;
const Comment = db.Comment;
const User = db.User;
const Profile = db.Profile;

/**
 * Cria um novo comentário em uma OKR, verificando a propriedade do usuário.
 */
exports.create = async (req, res) => {
    try {
        const { okrId } = req.params;
        const { content } = req.body;

        const okr = await Okr.findOne({ where: { id: okrId, user_id: req.user.id } });
        if (!okr) {
            return res.status(404).json({ error: "OKR não encontrada ou não autorizada." });
        }
        
        const comment = await Comment.create({
            content,
            okr_id: okrId,
            user_id: req.user.id
        });
        
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * Busca todos os comentários de uma OKR, incluindo os dados do autor.
 */
exports.findAllByOkr = async (req, res) => {
    try {
        const { okrId } = req.params;

        const okr = await Okr.findOne({ where: { id: okrId, user_id: req.user.id } });
        if (!okr) {
            return res.status(404).json({ error: "OKR não encontrada ou não autorizada." });
        }

        const comments = await Comment.findAll({
            where: { okr_id: okrId },
            include: [{
                model: User,
                as: 'user',
                include: [{ model: Profile, as: 'profile' }],
            }],
            order: [['createdAt', 'DESC']],
        });
        
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};