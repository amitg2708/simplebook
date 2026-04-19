import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(book);
  };

  return (
    <div className="book-card">
      <Link to={`/book/${book._id}`} className="book-card-link">
        <div className="book-image-wrapper">
          <img
            src={book.image || 'https://via.placeholder.com/200x280/6366f1/white?text=Book'}
            alt={book.title}
            className="book-image"
            onError={(e) => { e.target.src = 'https://via.placeholder.com/200x280/6366f1/white?text=Book'; }}
          />
          <div className="book-overlay">
            <span className="book-category">{book.category}</span>
          </div>
        </div>
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <div className="book-meta">
            <span className="book-rating">⭐ {book.rating?.toFixed(1)}</span>
            <span className="book-stock">{book.stock > 0 ? `${book.stock} left` : 'Out of Stock'}</span>
          </div>
          <p className="book-price">₹{book.price}</p>
        </div>
      </Link>
      <button
        className="btn btn-primary add-to-cart-btn"
        onClick={handleAddToCart}
        disabled={book.stock === 0}
      >
        {book.stock === 0 ? 'Out of Stock' : '+ Add to Cart'}
      </button>
    </div>
  );
};

export default BookCard;
