import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/orderService';
import { Link } from 'react-router-dom';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyOrders()
      .then(res => setOrders(res.data.orders))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  return (
    <div className="page">
      <h1 className="page-title">My Orders</h1>
      {orders.length === 0 ? (
        <div className="empty-state">
          <p>You haven't placed any orders yet.</p>
          <Link to="/" className="btn btn-primary">Browse Books</Link>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div>
                  <span className="order-id">#{order._id.slice(-8).toUpperCase()}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <span className={`status-badge status-${order.status}`}>{order.status}</span>
              </div>
              <div className="order-items-preview">
                {order.items.map((item) => (
                  <div key={item._id} className="order-item-mini">
                    <img src={item.image || 'https://via.placeholder.com/50x70/6366f1/white?text=B'}
                      alt={item.title} className="mini-book-img"
                      onError={(e) => { e.target.src = 'https://via.placeholder.com/50x70/6366f1/white?text=B'; }} />
                    <div>
                      <p className="mini-title">{item.title}</p>
                      <p className="mini-meta">Qty: {item.quantity} · ₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <strong>Total: ₹{order.totalAmount?.toFixed(2)}</strong>
                <Link to={`/order-confirmation/${order._id}`} className="btn btn-ghost">View Details →</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
