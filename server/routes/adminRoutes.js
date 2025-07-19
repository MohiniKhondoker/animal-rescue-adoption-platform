const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getAllProducts,
  getAllComplaints,
  promoteUserToAdmin,
  deleteUser,
  deleteProduct,
} = require('../controllers/adminController');

router.get('/users', authMiddleware, getAllUsers);
router.get('/products', authMiddleware, getAllProducts);
router.get('/complaints', authMiddleware, getAllComplaints);
router.post('/promote/:userId', authMiddleware, promoteUserToAdmin);

// New routes:
router.delete('/user/:userId', authMiddleware, deleteUser);
router.delete('/product/:productId', authMiddleware, deleteProduct);

module.exports = router;
