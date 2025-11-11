const express = require('express');
const router = express.Router();
const hoadonController = require('../controllers/hoadonController');

router.get('/', hoadonController.getAllHoadon);
router.get('/:id', hoadonController.getHoadonById);
router.get('/hopdong/:mahopdong', hoadonController.getHoadonByHopdong);
router.post('/', hoadonController.createHoadon);
router.put('/:id', hoadonController.updateHoadon);
router.delete('/:id', hoadonController.deleteHoadon);

module.exports = router;
