import { useCart } from '../context/CartContext';

const CartItem = ({ item }) => {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="cart-item">
      <img
        src={item.image || 'https://via.placeholder.com/80x100/6366f1/white?text=Book'}
        alt={item.title}
        className="cart-item-image"
        onError={(e) => { e.target.src = 'https://via.placeholder.com/80x100/6366f1/white?text=Book'; }}
      />
      <div className="cart-item-info">
        <h4 className="cart-item-title">{item.title}</h4>
        <p className="cart-item-author">by {item.author}</p>
        <p className="cart-item-price">₹{item.price} each</p>
      </div>
      <div className="cart-item-controls">
        <div className="qty-controls">
          <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity - 1)}>−</button>
          <span className="qty-display">{item.quantity}</span>
          <button className="qty-btn" onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
        </div>
        <p className="cart-item-total">₹{(item.price * item.quantity).toFixed(2)}</p>
        <button className="remove-btn" onClick={() => removeFromCart(item._id)}>🗑</button>
      </div>
    </div>
  );
};

export default CartItem;
