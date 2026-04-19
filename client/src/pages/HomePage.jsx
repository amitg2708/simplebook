import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import BookCard from '../components/BookCard';
import { getBooks, getCategories } from '../services/bookService';

const CATEGORIES = ['All', 'Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Self-Help', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Children', 'Education', 'Business', 'Philosophy'];

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParams] = useSearchParams();

  const fetchBooks = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 12 };
      const q = search || searchParams.get('search') || '';
      if (q) params.search = q;
      if (category !== 'All') params.category = category;
      if (sort) params.sort = sort;
      const res = await getBooks(params);
      setBooks(res.data.books);
      setTotalPages(res.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, category, sort, page, searchParams]);

  useEffect(() => { fetchBooks(); }, [fetchBooks]);

  return (
    <div className="page">
      {/* Hero Banner */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Discover Your Next <span className="gradient-text">Great Read</span></h1>
          <p className="hero-subtitle">Explore thousands of books across all genres. Free delivery on orders above ₹499.</p>
          <div className="hero-search">
            <input
              type="text"
              className="hero-input"
              placeholder="Search by title or author..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            />
            <button className="btn btn-primary" onClick={fetchBooks}>Search</button>
          </div>
        </div>
        <div className="hero-illustration">📚</div>
      </section>

      {/* Filters */}
      <section className="filters-section">
        <div className="category-pills">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`category-pill ${category === cat ? 'active' : ''}`}
              onClick={() => { setCategory(cat); setPage(1); }}
            >
              {cat}
            </button>
          ))}
        </div>
        <select className="sort-select" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort: Newest</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="rating">Top Rated</option>
          <option value="popular">Most Popular</option>
        </select>
      </section>

      {/* Books Grid */}
      <section className="books-section">
        {loading ? (
          <div className="loading-grid">
            {[...Array(12)].map((_, i) => <div key={i} className="book-skeleton" />)}
          </div>
        ) : books.length === 0 ? (
          <div className="empty-state">
            <p>😕 No books found. Try different search terms.</p>
          </div>
        ) : (
          <div className="books-grid">
            {books.map((book) => <BookCard key={book._id} book={book} />)}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage(page - 1)}>← Prev</button>
          {[...Array(totalPages)].map((_, i) => (
            <button key={i} className={`page-btn ${page === i + 1 ? 'active' : ''}`} onClick={() => setPage(i + 1)}>
              {i + 1}
            </button>
          ))}
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next →</button>
        </div>
      )}
    </div>
  );
};

export default HomePage;
