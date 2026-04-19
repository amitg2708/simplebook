const Order = require('../models/Order');
const Book = require('../models/Book');

// @desc    Sales report aggregated by month
// @route   GET /api/reports/sales
exports.getSalesReport = async (req, res) => {
  try {
    const { startDate, endDate, category } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
    }

    // Monthly sales aggregation
    const monthlySales = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          revenue: { $sum: '$totalAmount' },
          orders: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    // Category distribution
    const categoryStats = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'books',
          localField: 'items.book',
          foreignField: '_id',
          as: 'bookDetails'
        }
      },
      { $unwind: '$bookDetails' },
      {
        $group: {
          _id: '$bookDetails.category',
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
          sold: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Top selling books
    const topBooks = await Order.aggregate([
      { $match: matchQuery },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.book',
          title: { $first: '$items.title' },
          author: { $first: '$items.author' },
          totalSold: { $sum: '$items.quantity' },
          revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Summary
    const summary = await Order.aggregate([
      { $match: matchQuery },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$totalAmount' },
          totalOrders: { $sum: 1 },
          avgOrderValue: { $avg: '$totalAmount' }
        }
      }
    ]);

    // Individual orders for table
    const orders = await Order.find(matchQuery)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(100);

    res.json({
      success: true,
      data: {
        monthlySales,
        categoryStats,
        topBooks,
        summary: summary[0] || { totalRevenue: 0, totalOrders: 0, avgOrderValue: 0 },
        orders
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Orders report
// @route   GET /api/reports/orders
exports.getOrdersReport = async (req, res) => {
  try {
    const { startDate, endDate, status } = req.query;

    let matchQuery = {};
    if (startDate || endDate) {
      matchQuery.createdAt = {};
      if (startDate) matchQuery.createdAt.$gte = new Date(startDate);
      if (endDate) matchQuery.createdAt.$lte = new Date(endDate + 'T23:59:59.999Z');
    }
    if (status) matchQuery.status = status;

    const orders = await Order.find(matchQuery)
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    const statusBreakdown = await Order.aggregate([
      { $match: matchQuery },
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        orders,
        statusBreakdown,
        total: orders.length,
        totalRevenue: orders.reduce((acc, o) => acc + o.totalAmount, 0)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    User activity report
// @route   GET /api/reports/users
exports.getUserReport = async (req, res) => {
  try {
    const userActivity = await Order.aggregate([
      {
        $group: {
          _id: '$user',
          name: { $first: '$userName' },
          email: { $first: '$userEmail' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalAmount' },
          lastOrder: { $max: '$createdAt' }
        }
      },
      { $sort: { totalSpent: -1 } },
      { $limit: 50 }
    ]);

    res.json({ success: true, data: { users: userActivity } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
