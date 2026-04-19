import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBook } from '../services/bookService';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

const BookDetailPage = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    getBook(id)
      .then(res => setBook(res.data.book))
      .catch(() => toast.error('Book not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;
  if (!book) return <div className="empty-state">Book not found</div>;

  return (
    <div className="page">
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <div className="book-detail">
        <div className="book-detail-image">
          <img
            src={book.image || 'https://via.placeholder.com/300x420/6366f1/white?text=Book'}
            alt={book.title}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/300x420/6366f1/white?text=Book'; }}
          />
        </div>
        <div className="book-detail-info">
          <span className="book-category-tag">{book.category}</span>
          <h1 className="detail-title">{book.title}</h1>
          <p className="detail-author">by <strong>{book.author}</strong></p>
          <div className="detail-rating">
            {'⭐'.repeat(Math.round(book.rating || 4))} <span>{book.rating?.toFixed(1)} / 5.0</span>
          </div>
          <p className="detail-description">{book.description || 'No description available.'}</p>
          <div className="detail-meta">
            <span className="stock-badge" style={{ background: book.stock > 0 ? 'var(--success)' : 'var(--danger)' }}>
              {book.stock > 0 ? `✓ In Stock (${book.stock})` : '✗ Out of Stock'}
            </span>
            <span className="sold-badge">🔥 {book.totalSold || 0} sold</span>
          </div>
          <div className="detail-price">₹{book.price}</div>
          <div className="qty-row">
            <span>Quantity:</span>
            <div className="qty-controls">
              <button className="qty-btn" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span className="qty-display">{qty}</span>
              <button className="qty-btn" onClick={() => setQty(Math.min(book.stock, qty + 1))}>+</button>
            </div>
          </div>
          <div className="detail-actions">
            <button
              className="btn btn-primary"
              disabled={book.stock === 0}
              onClick={() => { addToCart(book, qty); }}
            >
              🛒 Add to Cart
            </button>
            <button
              className="btn btn-secondary"
              disabled={book.stock === 0}
              onClick={() => { addToCart(book, qty); navigate('/cart'); }}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;
