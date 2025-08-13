const express = require('express');
const router = express.Router();
const keyResultController = require('../controllers/keyResultController');
const auth = require('../middleware/auth');

router.put('/:id', auth, keyResultController.update);
router.delete('/:id', auth, keyResultController.delete);

module.exports = router;