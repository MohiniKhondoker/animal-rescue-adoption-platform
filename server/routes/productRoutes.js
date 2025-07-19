const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const { addProduct, getMyProducts, getAllProducts } = require('../controllers/productController');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.post('/', authMiddleware, upload.single('image'), addProduct);
router.get('/mine', authMiddleware, getMyProducts);
router.get('/all', getAllProducts);

module.exports = router;
