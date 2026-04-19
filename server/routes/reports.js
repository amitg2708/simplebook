const express = require('express');
const router = express.Router();
const { getSalesReport, getOrdersReport, getUserReport } = require('../controllers/reportController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/sales', auth, admin, getSalesReport);
router.get('/orders', auth, admin, getOrdersReport);
router.get('/users', auth, admin, getUserReport);

module.exports = router;
