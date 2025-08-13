const db = require('../models');
const Comment = db.Comment;

exports.create = async (req, res) => {
  try {
    const { okrId } = req.params;
    const comment = await Comment.create({
      ...req.body,
      okr_id: okrId,
      user_id: req.user.id
    });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.findAllByOkr = async (req, res) => {
  try {
    const { okrId } = req.params;
    const comments = await Comment.findAll({ where: { okr_id: okrId } });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};