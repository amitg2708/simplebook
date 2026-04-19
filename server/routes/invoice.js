const express = require('express');
const router = express.Router();
const { getInvoice } = require('../controllers/invoiceController');
const auth = require('../middleware/auth');

router.get('/:orderId', auth, getInvoice);

module.exports = router;
