import { useEffect, useState } from 'react';
import { getBooks, createBook, updateBook, deleteBook } from '../../services/bookService';
import toast from 'react-hot-toast';

const CATEGORIES = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Self-Help', 'Fantasy', 'Mystery', 'Romance', 'Horror', 'Children', 'Education', 'Business', 'Philosophy'];

const EMPTY = { title: '', author: '', description: '', price: '', category: 'Fiction', stock: '', image: '', rating: 4.0 };

const AdminBooks = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [search, setSearch] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await getBooks({ limit: 100, search });
      setBooks(res.data.books);
    } catch (e) { toast.error('Failed to load books'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBooks(); }, [search]);

  const openAdd = () => { setForm(EMPTY); setEditing(null); setShowModal(true); };
  const openEdit = (book) => { setForm({ ...book, price: book.price.toString(), stock: book.stock.toString() }); setEditing(book._id); setShowModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...form, price: Number(form.price), stock: Number(form.stock) };
      if (editing) { await updateBook(editing, payload); toast.success('Book updated!'); }
      else { await createBook(payload); toast.success('Book created!'); }
      setShowModal(false);
      fetchBooks();
    } catch (err) { toast.error(err.response?.data?.message || 'Error saving book'); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try { await deleteBook(id); toast.success('Deleted!'); fetchBooks(); }
    catch { toast.error('Failed to delete'); }
  };

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1 className="page-title">📚 Manage Books</h1>
        <div className="admin-controls">
          <input className="form-input" placeholder="Search books..." value={search}
            onChange={(e) => setSearch(e.target.value)} style={{ width: '250px' }} />
          <button className="btn btn-primary" onClick={openAdd}>+ Add Book</button>
        </div>
      </div>

      {loading ? <div className="loading-screen"><div className="spinner" /></div> : (
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr><th>Cover</th><th>Title</th><th>Author</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td><img src={book.image || 'https://via.placeholder.com/40x55/6366f1/white?text=B'}
                    alt="" style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '4px' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40x55/6366f1/white?text=B'; }} /></td>
                  <td><strong>{book.title}</strong></td>
                  <td>{book.author}</td>
                  <td><span className="category-tag">{book.category}</span></td>
                  <td>₹{book.price}</td>
                  <td><span className={book.stock < 5 ? 'low-stock' : ''}>{book.stock}</span></td>
                  <td>⭐ {book.rating}</td>
                  <td>
                    <button className="btn btn-sm btn-secondary" onClick={() => openEdit(book)}>Edit</button>
                    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book._id, book.title)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Book' : 'Add New Book'}</h2>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-row">
                <div className="form-group"><label className="form-label">Title</label>
                  <input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Author</label>
                  <input className="form-input" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Price (₹)</label>
                  <input type="number" className="form-input" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></div>
                <div className="form-group"><label className="form-label">Stock</label>
                  <input type="number" className="form-input" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required /></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Category</label>
                  <select className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                  </select></div>
                <div className="form-group"><label className="form-label">Rating</label>
                  <input type="number" step="0.1" min="0" max="5" className="form-input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></div>
              </div>
              <div className="form-group"><label className="form-label">Image URL</label>
                <input className="form-input" value={form.image} placeholder="https://..." onChange={(e) => setForm({ ...form, image: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Description</label>
                <textarea className="form-input" rows="3" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
              <div className="modal-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Create'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBooks;
