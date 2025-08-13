const db = require('../models');
const KeyResult = db.KeyResult;
const { sendEmailNotification } = require('../services/emailService')

exports.create = async (req, res) => {
  try {
    const { okrId } = req.params;
    const keyResult = await KeyResult.create({ ...req.body, okr_id: okrId });
    res.status(201).json(keyResult);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findAllByOkr = async (req, res) => {
  try {
    const { okrId } = req.params;
    const keyResults = await KeyResult.findAll({ where: { okr_id: okrId } });
    res.status(200).json(keyResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await KeyResult.update(req.body, {
      where: { id: id }
    });

    if (updated) {
      const updatedKr = await KeyResult.findByPk(id);
      // Aqui você poderia adicionar lógica de e-mail de notificação para KR
      return res.status(200).json(updatedKr);
    }
    throw new Error('Key Result not found');
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Excluir um Key Result
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await KeyResult.destroy({
      where: { id: id }
    });

    if (deleted) {
      return res.status(204).send();
    }
    return res.status(404).json({ error: 'Key Result not found' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};