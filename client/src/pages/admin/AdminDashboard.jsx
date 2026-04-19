import { useEffect, useState } from 'react';
import { getSalesReport } from '../../services/reportService';
import SalesBarChart from '../../charts/SalesBarChart';
import CategoryPieChart from '../../charts/CategoryPieChart';
import RevenueLineChart from '../../charts/RevenueLineChart';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSalesReport()
      .then((res) => setData(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading-screen"><div className="spinner" /></div>;

  const summary = data?.summary || {};

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1 className="page-title">🏠 Admin Dashboard</h1>
        <div className="admin-nav-links">
          <Link to="/admin/books" className="btn btn-primary">📚 Manage Books</Link>
          <Link to="/admin/orders" className="btn btn-secondary">📦 View Orders</Link>
          <Link to="/admin/reports" className="btn btn-ghost">📊 Reports</Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card kpi-revenue">
          <div className="kpi-icon">💰</div>
          <div className="kpi-info">
            <p className="kpi-label">Total Revenue</p>
            <h2 className="kpi-value">₹{(summary.totalRevenue || 0).toFixed(0)}</h2>
          </div>
        </div>
        <div className="kpi-card kpi-orders">
          <div className="kpi-icon">📦</div>
          <div className="kpi-info">
            <p className="kpi-label">Total Orders</p>
            <h2 className="kpi-value">{summary.totalOrders || 0}</h2>
          </div>
        </div>
        <div className="kpi-card kpi-avg">
          <div className="kpi-icon">📈</div>
          <div className="kpi-info">
            <p className="kpi-label">Avg. Order Value</p>
            <h2 className="kpi-value">₹{(summary.avgOrderValue || 0).toFixed(0)}</h2>
          </div>
        </div>
        <div className="kpi-card kpi-books">
          <div className="kpi-icon">📚</div>
          <div className="kpi-info">
            <p className="kpi-label">Top Category</p>
            <h2 className="kpi-value">{data?.categoryStats?.[0]?._id || 'N/A'}</h2>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <SalesBarChart data={data?.monthlySales} />
        <RevenueLineChart data={data?.monthlySales} />
        <CategoryPieChart data={data?.categoryStats} />

        {/* Top Books Table */}
        <div className="chart-card">
          <h3 className="chart-title">🏆 Top Selling Books</h3>
          <table className="data-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {(data?.topBooks || []).slice(0, 5).map((book, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{book.title}</td>
                  <td>{book.totalSold}</td>
                  <td>₹{(book.revenue || 0).toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
