const express = require('express');
const router = express.Router();
const saucesCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/', auth, saucesCtrl.getAllSauces);
router.get("/:id", auth, saucesCtrl.getOneSauce);
router.post('/', multer, saucesCtrl.createSauce);
router.put('/:id', auth, multer, saucesCtrl.updateOneSauce);
router.delete('/:id', auth, saucesCtrl.deleteSauce);
router.post('/:id/like', auth, saucesCtrl.likeSauce);

module.exports = router; 