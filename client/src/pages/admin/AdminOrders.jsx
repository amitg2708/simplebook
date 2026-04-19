import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/orderService';
import toast from 'react-hot-toast';

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = filter ? { status: filter } : {};
      const res = await getAllOrders(params);
      setOrders(res.data.orders);
    } catch (e) { toast.error('Failed to load orders'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const handleStatusChange = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      toast.success('Status updated!');
      fetchOrders();
    } catch { toast.error('Failed to update status'); }
  };

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1 className="page-title">📦 All Orders</h1>
        <select className="form-input" style={{ width: 200 }} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div className="table-wrapper">
          <p className="table-meta">Showing {orders.length} orders</p>
          <table className="data-table">
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Date</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td><code>#{order._id.slice(-8).toUpperCase()}</code></td>
                  <td>
                    <div><strong>{order.userName || order.user?.name}</strong></div>
                    <small>{order.userEmail || order.user?.email}</small>
                  </td>
                  <td>{order.items?.length} items</td>
                  <td><strong>₹{order.totalAmount?.toFixed(2)}</strong></td>
                  <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                  <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                  <td>
                    <select className="form-input" style={{ width: 130, padding: '4px 8px' }}
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
