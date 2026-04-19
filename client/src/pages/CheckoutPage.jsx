import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../services/orderService';
import toast from 'react-hot-toast';

const CheckoutPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', state: '', zipCode: '', country: 'India' });

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) { toast.error('Your cart is empty'); return; }
    setLoading(true);
    try {
      const items = cart.map((i) => ({ bookId: i._id, quantity: i.quantity }));
      const res = await placeOrder({ items, address, paymentMethod: 'COD' });
      clearCart();
      toast.success('Order placed successfully! 🎉');
      navigate(`/order-confirmation/${res.data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <h1 className="page-title">Checkout</h1>
      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <div className="form-section">
            <h2 className="form-section-title">📦 Delivery Address</h2>
            <div className="form-group">
              <label className="form-label">Street Address</label>
              <input className="form-input" placeholder="123 Main Street, Apt 4B" value={address.street}
                onChange={(e) => setAddress({ ...address, street: e.target.value })} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">City</label>
                <input className="form-input" placeholder="Mumbai" value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input className="form-input" placeholder="Maharashtra" value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })} required />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">ZIP / PIN Code</label>
                <input className="form-input" placeholder="400001" value={address.zipCode}
                  onChange={(e) => setAddress({ ...address, zipCode: e.target.value })} required />
              </div>
              <div className="form-group">
                <label className="form-label">Country</label>
                <input className="form-input" value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })} required />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2 className="form-section-title">💳 Payment Method</h2>
            <div className="payment-option selected">
              <input type="radio" defaultChecked id="cod" />
              <label htmlFor="cod">Cash on Delivery (COD)</label>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order · ₹${cartTotal.toFixed(2)}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="checkout-summary">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            {cart.map((item) => (
              <div key={item._id} className="summary-item">
                <span>{item.title} × {item.quantity}</span>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="summary-divider" />
            <div className="summary-row total-row">
              <span>Total</span><span>₹{cartTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
