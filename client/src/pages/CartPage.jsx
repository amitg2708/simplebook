import { useCart } from '../context/CartContext';
import CartItem from '../components/CartItem';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="page">
        <div className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some amazing books to get started!</p>
          <Link to="/" className="btn btn-primary">Browse Books</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <h1 className="page-title">Shopping Cart</h1>
      <div className="cart-layout">
        <div className="cart-items-list">
          {cart.map((item) => <CartItem key={item._id} item={item} />)}
          <button className="btn btn-ghost" onClick={clearCart}>🗑 Clear Cart</button>
        </div>
        <div className="cart-summary">
          <div className="summary-card">
            <h3 className="summary-title">Order Summary</h3>
            <div className="summary-row"><span>Items ({cart.length})</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <div className="summary-row"><span>Shipping</span><span className="free-tag">FREE</span></div>
            <div className="summary-divider" />
            <div className="summary-row total-row"><span>Total</span><span>₹{cartTotal.toFixed(2)}</span></div>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/checkout')}>
              Proceed to Checkout →
            </button>
            <Link to="/" className="btn btn-ghost btn-full" style={{ marginTop: '10px' }}>
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
