import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      toast.error('An error occurred while fetching users');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        toast.success('User deleted successfully');
        setUsers(users.filter(u => u._id !== id));
      } else {
        toast.error(data.message || 'Failed to delete user');
      }
    } catch (err) {
      toast.error('An error occurred while deleting user');
    }
  };

  if (loading) return <div className="loading-spinner">Loading users...</div>;

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1 className="page-title">👥 User Management</h1>
      </div>
      
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td><code>#{user._id.slice(-8).toUpperCase()}</code></td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className={`status-badge status-${user.role === 'admin' ? 'delivered' : 'pending'}`}>
                    {user.role}
                  </span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                <td>
                  <button 
                    className="btn btn-outline" 
                    onClick={() => deleteUser(user._id)}
                    style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;
