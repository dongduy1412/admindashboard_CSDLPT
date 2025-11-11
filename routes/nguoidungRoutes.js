const express = require('express');
const router = express.Router();
const nguoidungController = require('../controllers/nguoidungController');

router.get('/', nguoidungController.getAllNguoidung);
router.get('/:id', nguoidungController.getNguoidungById);
router.post('/', nguoidungController.createNguoidung);
router.put('/:id', nguoidungController.updateNguoidung);
router.delete('/:id', nguoidungController.deleteNguoidung);

module.exports = router;
