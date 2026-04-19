import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder } from '../services/orderService';
import Invoice from '../components/Invoice';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showInvoice, setShowInvoice] = useState(false);

  useEffect(() => {
    getOrder(orderId)
      .then(res => setOrder(res.data.order))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <div className="confirmation-card">
        <div className="confirmation-icon">✅</div>
        <h1 className="confirmation-title">Order Placed Successfully!</h1>
        <p className="confirmation-subtitle">Thank you for your order. We'll send a confirmation email shortly.</p>
        {order && (
          <>
            <div className="order-id-badge">Order ID: #{order._id.slice(-8).toUpperCase()}</div>
            <div className="order-info">
              <p><strong>Delivery to:</strong> {order.address?.street}, {order.address?.city}</p>
              <p><strong>Total:</strong> ₹{order.totalAmount?.toFixed(2)}</p>
              <p><strong>Payment:</strong> {order.paymentMethod} | <strong>Status:</strong> <span className="status-badge">{order.status}</span></p>
            </div>
            <div className="confirmation-actions">
              <button className="btn btn-primary" onClick={() => setShowInvoice(!showInvoice)}>
                {showInvoice ? 'Hide Invoice' : '🧾 View Invoice'}
              </button>
              <Link to="/my-orders" className="btn btn-secondary">My Orders</Link>
              <Link to="/" className="btn btn-ghost">Continue Shopping</Link>
            </div>
            {showInvoice && <Invoice order={order} />}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
