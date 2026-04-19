import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import ThemeToggle from './ThemeToggle';
import { useState } from 'react';

const Navbar = ({ onSearch }) => {
  const { user, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchVal);
    else navigate(`/?search=${searchVal}`);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/" className="brand-link">
          <span className="brand-icon">📚</span>
          <span className="brand-name">BookStore</span>
        </Link>
      </div>

      <form className="search-form" onSubmit={handleSearch}>
        <input
          type="text"
          className="search-input"
          placeholder="Search books, authors..."
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
        />
        <button type="submit" className="search-btn">🔍</button>
      </form>

      <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <Link to="/" className="nav-link">Home</Link>
        {user ? (
          <>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/my-orders" className="nav-link">My Orders</Link>
            {user.role === 'admin' && (
              <>
                <Link to="/admin" className="nav-link admin-link">Admin</Link>
                <Link to="/admin/users" className="nav-link admin-link" style={{ marginLeft: '10px' }}>Users</Link>
              </>
            )}
            <button onClick={handleLogout} className="btn btn-ghost">Logout</button>
            <span className="user-badge">{user.name}</span>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">Login</Link>
            <Link to="/register" className="btn btn-primary">Sign Up</Link>
          </>
        )}
        <Link to="/cart" className="cart-icon">
          🛒 <span className="cart-count">{cartCount}</span>
        </Link>
        <ThemeToggle />
      </div>

      <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>☰</button>
    </nav>
  );
};

export default Navbar;
