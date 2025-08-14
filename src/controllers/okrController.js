const db = require('../models');
const Okr = db.Okr;
const KeyResult = db.KeyResult;
const Comment = db.Comment;
const User = db.User;
const Profile = db.Profile
const Notification = db.Notification;
const { sendEmailNotification } = require('../services/emailService')

const getUserEmail = async (userId) => {
    const user = await User.findByPk(userId);
    return user ? user.email : null;
};

const calculateOverallProgress = (keyResults) => {
    if (!keyResults || keyResults.length === 0) {
        return 0;
    }
    const totalProgress = keyResults.reduce((sum, kr) => {
        if (kr.target > 0) {
            return sum + (Math.min(kr.current_value / kr.target, 1) * 100);
        }
        return sum;
    }, 0);
    return Math.round(Math.min(totalProgress / keyResults.length, 100));
};

// Função para determinar o status da OKR
const calculateOKRStatus = (dueDate, progress) => {
    const now = new Date();
    const deadline = new Date(dueDate);
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (progress >= 100) {
        return 'completed';
    }
    if (now > deadline) {
        return 'behind';
    }
    if (diffDays <= 2 && progress < 100) {
        return 'at-risk';
    }
    return 'on-track';
};


// Criar um novo OKR
exports.create = async (req, res) => {
    try {
        const { title, description, responsible, due_date } = req.body;
        const newOkr = await Okr.create({
            title,
            description,
            responsible,
            due_date,
            user_id: req.user.id
        });

        await Notification.create({
            user_id: req.user.id,
            event_type: 'update',
            message: `O OKR '${title}' foi criado.`,
            link_to: `/okr/${newOkr.id}`
        });

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

// Obter todos os OKRs do usuário autenticado
exports.findAll = async (req, res) => {
    try {
        const okrs = await Okr.findAll({
            where: { user_id: req.user.id },
            include: [
                { model: KeyResult, as: 'keyResults' },
                { model: Comment, as: 'comments' }
            ]
        });

        const okrsWithStatus = okrs.map(okr => {
            const progress = calculateOverallProgress(okr.keyResults);
            const status = calculateOKRStatus(okr.due_date, progress);
            return {
                ...okr.toJSON(),
                progress: progress,
                status: status,
            };
        });

        res.status(200).json(okrsWithStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter um OKR por ID do usuário autenticado
exports.findOne = async (req, res) => {
    try {
        const { id } = req.params;
        const okr = await Okr.findOne({
            where: { id: id, user_id: req.user.id },
            include: [
                { model: KeyResult, as: 'keyResults' },
                { model: Comment, as: 'comments' }
            ]
        });

        if (!okr) {
            return res.status(404).json({ message: 'OKR not found or not authorized' });
        }

        const progress = calculateOverallProgress(okr.keyResults);
        const status = calculateOKRStatus(okr.due_date, progress);

        const okrWithStatus = {
            ...okr.toJSON(),
            progress: progress,
            status: status
        };

        res.status(200).json(okrWithStatus);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Atualizar um OKR do usuário autenticado
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, responsible, due_date } = req.body;

        // Busque o OKR para verificar a posse e obter os Key Results
        const okrToUpdate = await Okr.findOne({
            where: { id: id, user_id: req.user.id },
            include: [{ model: KeyResult, as: 'keyResults' }]
        });

        if (!okrToUpdate) {
            return res.status(404).json({ error: 'OKR not found or not authorized' });
        }

        // Calcule o progresso e o status dinamicamente
        const progress = calculateOverallProgress(okrToUpdate.keyResults);
        const status = calculateOKRStatus(due_date || okrToUpdate.due_date, progress);

        // Atualiza a OKR no banco de dados
        await Okr.update({
            title,
            description,
            responsible,
            due_date,
            status,
        }, {
            where: { id: id, user_id: req.user.id }
        });

        // NOTIFICAÇÃO 1: Crie uma notificação no banco de dados
        await Notification.create({
            user_id: req.user.id,
            event_type: 'update',
            message: `O OKR '${title}' foi atualizado.`,
            link_to: `/okr/${id}`
        });

        // Obtenha o usuário completo para enviar o e-mail
        const updatingUser = await User.findByPk(req.user.id, {
            include: [{ model: Profile, as: 'profile' }]
        });
        
        // NOTIFICAÇÃO 2: Envie o e-mail para o usuário que fez a alteração
        if (updatingUser && updatingUser.email) {
            const emailContent = `<p>Olá ${updatingUser.profile?.first_name || ''},<br/><br/>Seu OKR <strong>"${title}"</strong> foi atualizado com sucesso.</p>`;
            await sendEmailNotification(
                updatingUser.email,
                `OKR Atualizada: ${title}`,
                emailContent
            );
        }

        const updatedOkr = await Okr.findByPk(id, {
            include: [
                { model: KeyResult, as: 'keyResults' },
                { model: Comment, as: 'comments' }
            ]
        });

        return res.status(200).json({
            ...updatedOkr.toJSON(),
            progress: progress,
            status: status,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Excluir um OKR do usuário autenticado
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const okrToDelete = await Okr.findOne({ where: { id: id, user_id: req.user.id } });

        if (!okrToDelete) {
            return res.status(404).json({ error: 'OKR not found or not authorized' });
        }

        await okrToDelete.destroy();

        const userEmail = await getUserEmail(req.user.id);
        if (userEmail) {
            const emailContent = `<p>A OKR <strong>"${okrToDelete.title}"</strong> foi excluída com sucesso.</p>`;
            await sendEmailNotification(
                userEmail,
                `OKR Excluída: ${okrToDelete.title}`,
                emailContent
            );
        }

        return res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir OKR:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Criar um Key Result para um OKR específico
exports.createKeyResult = async (req, res) => {
    try {
        const { okrId } = req.params;
        const { title, target, unit, current_value } = req.body;
        const okr = await Okr.findOne({ where: { id: okrId, user_id: req.user.id } });

        if (!okr) {
            return res.status(404).json({ error: "OKR not found or not authorized." });
        }

        const keyResult = await KeyResult.create({
            title,
            target,
            unit,
            current_value,
            okr_id: okrId,
        });

        const updatedOkrWithKrs = await Okr.findByPk(okrId, {
            include: [{ model: KeyResult, as: 'keyResults' }]
        });

        const progress = calculateOverallProgress(updatedOkrWithKrs.keyResults);
        const status = calculateOKRStatus(updatedOkrWithKrs.due_date, progress);

        await Okr.update({ status: status }, { where: { id: okrId } });

        res.status(201).json({
            ...keyResult.toJSON(),
            okrProgress: progress,
            okrStatus: status,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.createComment = async (req, res) => {
    try {
        const { okrId } = req.params;
        const { content } = req.body;

        const okr = await Okr.findOne({ where: { id: okrId, user_id: req.user.id } });
        if (!okr) {
            return res.status(404).json({ error: "OKR not found or not authorized." });
        }

        const comment = await Comment.create({
            content,
            okr_id: okrId,
            user_id: req.user.id,
        });

        // CORREÇÃO: Busque o perfil do usuário que está comentando
        const commentingUser = await User.findByPk(req.user.id, {
            include: [{ model: Profile, as: 'profile' }]
        });

        // Verifique se o perfil existe antes de usar
        if (commentingUser && commentingUser.profile) {
            await Notification.create({
                user_id: okr.user_id,
                event_type: 'comment',
                message: `${commentingUser.profile.first_name} comentou no OKR '${okr.title}'.`,
                link_to: `/okr/${okrId}`
            });
        }
        
        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Obter todos os comentários de uma OKR
exports.getComments = async (req, res) => {
    try {
        const { okrId } = req.params;

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

exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.findAll({
            where: { user_id: req.user.id },
            order: [['createdAt', 'DESC']],
            limit: 3,
        });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};