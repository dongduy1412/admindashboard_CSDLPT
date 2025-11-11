const express = require('express');
const router = express.Router();
const hopdongController = require('../controllers/hopdongController');

router.get('/', hopdongController.getAllHopdong);
router.get('/:id', hopdongController.getHopdongById);
router.get('/:id/khachthue', hopdongController.getHopdongWithKhachthue);
router.post('/', hopdongController.createHopdong);
router.put('/:id', hopdongController.updateHopdong);
router.delete('/:id', hopdongController.deleteHopdong);
router.post('/khachthue', hopdongController.addKhachthueToHopdong);
router.delete('/:mahopdong/khachthue/:makhachthue', hopdongController.removeKhachthueFromHopdong);

module.exports = router;
