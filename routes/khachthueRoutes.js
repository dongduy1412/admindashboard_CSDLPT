const express = require('express');
const router = express.Router();
const khachthueController = require('../controllers/khachthueController');

router.get('/', khachthueController.getAllKhachthue);
router.get('/:id', khachthueController.getKhachthueById);
router.get('/hopdong/:id', khachthueController.getKhachthueWithHopdong)
router.post('/', khachthueController.createKhachthue);
router.put('/:id', khachthueController.updateKhachthue);
router.delete('/:id', khachthueController.deleteKhachthue);

module.exports = router;
