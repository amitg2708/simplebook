import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast from 'react-hot-toast';

const Invoice = ({ order }) => {
  const invoiceRef = useRef();

  const downloadPDF = async () => {
    toast.loading('Generating Invoice PDF...');
    try {
      const canvas = await html2canvas(invoiceRef.current, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${order._id.slice(-8).toUpperCase()}.pdf`);
      toast.dismiss();
      toast.success('Invoice downloaded!');
    } catch {
      toast.dismiss();
      toast.error('Failed to generate PDF');
    }
  };

  return (
    <div className="invoice-wrapper">
      <div className="invoice" ref={invoiceRef}>
        {/* Invoice Header */}
        <div className="invoice-header">
          <div className="invoice-brand">
            <span className="brand-icon large">📚</span>
            <div>
              <h2 className="invoice-brand-name">BookStore</h2>
              <p>Your Premier Online Bookstore</p>
              <p>support@bookstore.com</p>
            </div>
          </div>
          <div className="invoice-title-block">
            <h1 className="invoice-title">INVOICE</h1>
            <p>Invoice #: <strong>{order._id.slice(-8).toUpperCase()}</strong></p>
            <p>Date: <strong>{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</strong></p>
            <p>Status: <span className={`status-badge status-${order.status}`}>{order.status}</span></p>
          </div>
        </div>

        <hr className="invoice-divider" />

        {/* Bill To */}
        <div className="invoice-meta">
          <div>
            <h3 className="invoice-section-label">BILL TO</h3>
            <p><strong>{order.userName || order.user?.name}</strong></p>
            <p>{order.userEmail || order.user?.email}</p>
            <p>{order.address?.street}</p>
            <p>{order.address?.city}, {order.address?.state} - {order.address?.zipCode}</p>
            <p>{order.address?.country}</p>
          </div>
          <div>
            <h3 className="invoice-section-label">PAYMENT</h3>
            <p>Method: <strong>{order.paymentMethod || 'COD'}</strong></p>
            <p>Order ID: <strong>{order._id.slice(-12).toUpperCase()}</strong></p>
          </div>
        </div>

        {/* Items Table */}
        <table className="invoice-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Book Title</th>
              <th>Author</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.items?.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.title}</td>
                <td>{item.author}</td>
                <td>{item.quantity}</td>
                <td>₹{item.price?.toFixed(2)}</td>
                <td>₹{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totals */}
        <div className="invoice-totals">
          <div className="total-row"><span>Subtotal</span><span>₹{order.totalAmount?.toFixed(2)}</span></div>
          <div className="total-row"><span>Shipping</span><span>FREE</span></div>
          <div className="total-row grand-total"><span>TOTAL</span><span>₹{order.totalAmount?.toFixed(2)}</span></div>
        </div>

        <div className="invoice-footer">
          <p>Thank you for shopping with BookStore! 📚</p>
        </div>
      </div>

      <button className="btn btn-primary" onClick={downloadPDF} style={{ marginTop: '16px' }}>
        ⬇ Download Invoice PDF
      </button>
    </div>
  );
};

export default Invoice;
