const express = require('express');
const router = express.Router();
const okrController = require('../controllers/okrController');
const keyResultController = require('../controllers/keyResultController');
const commentController = require('../controllers/commentController');
const auth = require('../middleware/auth');

// Rotas para Notificações
router.get('/notifications', auth, okrController.getNotifications);

// Rotas para OKRs (protegidas)
router.post('/', auth, okrController.create);
router.get('/', auth, okrController.findAll);
router.get('/:id', auth, okrController.findOne);
router.put('/:id', auth, okrController.update);
router.delete('/:id', auth, okrController.delete);

// Rotas aninhadas para Key Results
router.post('/:okrId/key-results', auth, keyResultController.create);
router.get('/:okrId/key-results', auth, keyResultController.findAllByOkr);

// Rotas aninhadas para Comments
router.post('/:okrId/comments', auth, commentController.create);
router.get('/:okrId/comments', auth, commentController.findAllByOkr);

module.exports = router;