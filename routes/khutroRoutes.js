const express = require('express');
const router = express.Router();
const khutroController = require('../controllers/khutroController');

router.get('/', khutroController.getAllKhutro);
router.get('/:id', khutroController.getKhutroById);
router.post('/', khutroController.createKhutro);
router.put('/:id', khutroController.updateKhutro);
router.delete('/:id', khutroController.deleteKhutro);

module.exports = router;
