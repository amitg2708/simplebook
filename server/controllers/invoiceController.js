const Order = require('../models/Order');
const { generateInvoicePDF } = require('../utils/pdfGenerator');

// @desc    Generate and stream invoice PDF
// @route   GET /api/invoice/:orderId
exports.getInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId).populate('user', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure users can only access their own invoices
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${order._id}.pdf`);

    const doc = generateInvoicePDF(order);
    doc.pipe(res);
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
