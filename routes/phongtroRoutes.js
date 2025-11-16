const express = require('express');
const router = express.Router();
const phongtroController = require('../controllers/phongtroController');

router.get('/', phongtroController.getAllPhongtro);
router.get('/ok', phongtroController.getAllOK)
router.get('/:id', phongtroController.getPhongtroById);
router.post('/', phongtroController.createPhongtro);
router.put('/:id', phongtroController.updatePhongtro);
router.delete('/:id', phongtroController.deletePhongtro);

module.exports = router;
