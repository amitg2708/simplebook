const PDFDocument = require('pdfkit');

const generateInvoicePDF = (order) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  // Header
  doc.fillColor('#6366f1').fontSize(28).font('Helvetica-Bold').text('📚 BookStore', 50, 50);
  doc.fillColor('#374151').fontSize(10).font('Helvetica').text('Your Premier Online Bookstore', 50, 85);

  // Invoice Title
  doc.fillColor('#111827').fontSize(22).font('Helvetica-Bold').text('INVOICE', 400, 50, { align: 'right' });
  doc.fillColor('#6B7280').fontSize(10).font('Helvetica')
    .text(`Invoice #: ${order._id.toString().slice(-8).toUpperCase()}`, 400, 80, { align: 'right' })
    .text(`Date: ${new Date(order.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}`, 400, 95, { align: 'right' })
    .text(`Status: ${order.status.toUpperCase()}`, 400, 110, { align: 'right' });

  // Divider
  doc.moveTo(50, 130).lineTo(545, 130).strokeColor('#E5E7EB').lineWidth(1).stroke();

  // Bill To
  doc.fillColor('#6366f1').fontSize(11).font('Helvetica-Bold').text('BILL TO', 50, 145);
  doc.fillColor('#111827').fontSize(10).font('Helvetica')
    .text(order.userName || order.user?.name || 'Customer', 50, 162)
    .text(order.userEmail || order.user?.email || '', 50, 177)
    .text(order.address?.street || '', 50, 192)
    .text(`${order.address?.city || ''}, ${order.address?.state || ''} - ${order.address?.zipCode || ''}`, 50, 207)
    .text(order.address?.country || 'India', 50, 222);

  // Payment
  doc.fillColor('#6366f1').fontSize(11).font('Helvetica-Bold').text('PAYMENT', 350, 145);
  doc.fillColor('#111827').fontSize(10).font('Helvetica')
    .text(`Method: ${order.paymentMethod || 'COD'}`, 350, 162)
    .text(`Order ID: ${order._id.toString().slice(-12).toUpperCase()}`, 350, 177);

  // Table header
  const tableTop = 260;
  doc.fillColor('#6366f1').rect(50, tableTop, 495, 25).fill();
  doc.fillColor('#FFFFFF').fontSize(10).font('Helvetica-Bold')
    .text('#', 60, tableTop + 7)
    .text('Book Title', 80, tableTop + 7)
    .text('Author', 280, tableTop + 7)
    .text('Qty', 380, tableTop + 7)
    .text('Price', 420, tableTop + 7)
    .text('Amount', 470, tableTop + 7);

  // Table rows
  let y = tableTop + 30;
  order.items.forEach((item, i) => {
    const rowColor = i % 2 === 0 ? '#F9FAFB' : '#FFFFFF';
    doc.fillColor(rowColor).rect(50, y - 5, 495, 22).fill();
    doc.fillColor('#111827').fontSize(9).font('Helvetica')
      .text(i + 1, 60, y)
      .text(item.title.length > 35 ? item.title.substring(0, 35) + '...' : item.title, 80, y)
      .text(item.author || '', 280, y)
      .text(item.quantity, 385, y)
      .text(`₹${item.price.toFixed(2)}`, 415, y)
      .text(`₹${(item.price * item.quantity).toFixed(2)}`, 465, y);
    y += 22;
  });

  // Totals
  y += 10;
  doc.moveTo(50, y).lineTo(545, y).strokeColor('#E5E7EB').lineWidth(1).stroke();
  y += 15;

  doc.fillColor('#111827').fontSize(11).font('Helvetica-Bold')
    .text('Subtotal:', 380, y)
    .text(`₹${order.totalAmount.toFixed(2)}`, 470, y);
  y += 18;

  doc.fontSize(10).font('Helvetica').fillColor('#6B7280')
    .text('Shipping:', 380, y)
    .text('FREE', 470, y);
  y += 18;

  doc.moveTo(370, y).lineTo(545, y).strokeColor('#6366f1').lineWidth(1).stroke();
  y += 10;

  doc.fillColor('#6366f1').fontSize(14).font('Helvetica-Bold')
    .text('TOTAL:', 370, y)
    .text(`₹${order.totalAmount.toFixed(2)}`, 450, y);

  // Footer
  doc.fillColor('#6B7280').fontSize(9).font('Helvetica')
    .text('Thank you for shopping with BookStore! 📚', 50, 730, { align: 'center' })
    .text('For support, contact: support@bookstore.com', 50, 745, { align: 'center' });

  return doc;
};

const generateSalesReportPDF = (reportData, filters) => {
  const doc = new PDFDocument({ margin: 50, size: 'A4' });

  doc.fillColor('#6366f1').fontSize(24).font('Helvetica-Bold').text('📊 Sales Report', 50, 50);
  doc.fillColor('#6B7280').fontSize(10).font('Helvetica')
    .text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 50, 82);

  if (filters.startDate || filters.endDate) {
    doc.text(`Period: ${filters.startDate || 'Start'} to ${filters.endDate || 'Today'}`, 50, 97);
  }

  doc.moveTo(50, 115).lineTo(545, 115).strokeColor('#E5E7EB').stroke();

  // Summary
  const s = reportData.summary;
  doc.fillColor('#111827').fontSize(12).font('Helvetica-Bold').text('Summary', 50, 130);
  doc.fontSize(10).font('Helvetica')
    .text(`Total Revenue: ₹${(s?.totalRevenue || 0).toFixed(2)}`, 50, 150)
    .text(`Total Orders: ${s?.totalOrders || 0}`, 50, 165)
    .text(`Average Order Value: ₹${(s?.avgOrderValue || 0).toFixed(2)}`, 50, 180);

  // Monthly sales table
  if (reportData.monthlySales && reportData.monthlySales.length > 0) {
    doc.fillColor('#6366f1').fontSize(12).font('Helvetica-Bold').text('Monthly Sales', 50, 210);
    let y = 230;
    doc.fillColor('#6366f1').rect(50, y, 495, 22).fill();
    doc.fillColor('#FFF').fontSize(10).font('Helvetica-Bold')
      .text('Month', 60, y + 5)
      .text('Orders', 250, y + 5)
      .text('Revenue', 380, y + 5);
    y += 27;
    const months = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    reportData.monthlySales.forEach((m, i) => {
      doc.fillColor(i % 2 === 0 ? '#F9FAFB' : '#FFF').rect(50, y - 5, 495, 20).fill();
      doc.fillColor('#111827').fontSize(9).font('Helvetica')
        .text(`${months[m._id.month]} ${m._id.year}`, 60, y)
        .text(m.orders, 250, y)
        .text(`₹${m.revenue.toFixed(2)}`, 380, y);
      y += 20;
    });
  }

  doc.fillColor('#6B7280').fontSize(9).text('© BookStore 2024 — Confidential Report', 50, 750, { align: 'center' });
  return doc;
};

module.exports = { generateInvoicePDF, generateSalesReportPDF };
