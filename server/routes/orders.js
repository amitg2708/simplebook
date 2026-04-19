const express = require('express');
const router = express.Router();
const { placeOrder, getAllOrders, getMyOrders, getOrder, updateOrderStatus } = require('../controllers/orderController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.post('/', auth, placeOrder);
router.get('/', auth, admin, getAllOrders);
router.get('/my', auth, getMyOrders);
router.get('/:id', auth, getOrder);
router.put('/:id/status', auth, admin, updateOrderStatus);

module.exports = router;
