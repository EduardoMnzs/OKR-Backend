const db = require('../models');
const KeyResult = db.KeyResult;

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