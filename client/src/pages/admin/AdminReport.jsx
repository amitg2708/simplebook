import { useState } from 'react';
import { getSalesReport, getOrdersReport, getUserReport } from '../../services/reportService';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import SalesBarChart from '../../charts/SalesBarChart';
import toast from 'react-hot-toast';

const AdminReport = () => {
  const [reportType, setReportType] = useState('sales');
  const [filters, setFilters] = useState({ startDate: '', endDate: '', category: '' });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.category) params.category = filters.category;

      let res;
      if (reportType === 'sales') res = await getSalesReport(params);
      else if (reportType === 'orders') res = await getOrdersReport(params);
      else res = await getUserReport();
      setData(res.data.data);
    } catch (err) {
      toast.error('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async () => {
    const el = document.getElementById('report-content');
    if (!el) return;
    toast.loading('Generating PDF...');
    try {
      const canvas = await html2canvas(el, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`bookstore-report-${reportType}-${new Date().toISOString().slice(0, 10)}.pdf`);
      toast.dismiss();
      toast.success('PDF downloaded!');
    } catch {
      toast.dismiss();
      toast.error('PDF generation failed');
    }
  };

  const summary = reportType === 'sales' ? data?.summary : (reportType === 'orders' ? { totalRevenue: data?.totalRevenue, totalOrders: data?.total } : null);
  const orders = reportType !== 'users' ? data?.orders : null;

  return (
    <div className="page admin-page">
      <div className="admin-header">
        <h1 className="page-title">📊 Report Generator</h1>
        {data && (
          <button className="btn btn-primary" onClick={downloadPDF}>⬇ Download PDF</button>
        )}
      </div>

      {/* Filters */}
      <div className="report-filters">
        <div className="form-group">
          <label className="form-label">Report Type</label>
          <select className="form-input" value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="sales">Sales Report</option>
            <option value="orders">Orders Report</option>
            <option value="users">User Activity Report</option>
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Start Date</label>
          <input type="date" className="form-input" value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
        </div>
        <div className="form-group">
          <label className="form-label">End Date</label>
          <input type="date" className="form-input" value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
        </div>
        <button className="btn btn-primary" onClick={generateReport} disabled={loading}>
          {loading ? 'Generating...' : '🔍 Generate'}
        </button>
      </div>

      {/* Report Content */}
      {data && (
        <div id="report-content" className="report-content">
          <div className="report-header">
            <h2 className="report-title">📚 BookStore — {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report</h2>
            <p className="report-date">Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>

          {/* Summary Cards */}
          {summary && (
          <div className="kpi-grid">
            <div className="kpi-card kpi-revenue">
              <div className="kpi-icon">💰</div>
              <div className="kpi-info">
                <p className="kpi-label">Total Revenue</p>
                <h2 className="kpi-value">₹{(summary?.totalRevenue || 0).toFixed(2)}</h2>
              </div>
            </div>
            <div className="kpi-card kpi-orders">
              <div className="kpi-icon">📦</div>
              <div className="kpi-info">
                <p className="kpi-label">Total Orders</p>
                <h2 className="kpi-value">{summary?.totalOrders || 0}</h2>
              </div>
            </div>
            {summary?.avgOrderValue && (
              <div className="kpi-card kpi-avg">
                <div className="kpi-icon">📈</div>
                <div className="kpi-info">
                  <p className="kpi-label">Avg. Order Value</p>
                  <h2 className="kpi-value">₹{(summary.avgOrderValue).toFixed(2)}</h2>
                </div>
              </div>
            )}
          </div>
          )}

          {reportType === 'sales' && data.monthlySales && (
            <SalesBarChart data={data.monthlySales} />
          )}

          {/* Orders Table */}
          {orders && orders.length > 0 && (
            <div className="table-wrapper">
              <h3 className="chart-title">Order Details</h3>
              <table className="data-table">
                <thead>
                  <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr>
                </thead>
                <tbody>
                  {orders.slice(0, 50).map((order) => (
                    <tr key={order._id}>
                      <td><code>#{order._id.slice(-8).toUpperCase()}</code></td>
                      <td>{order.userName || order.user?.name || 'N/A'}</td>
                      <td>{order.items?.length}</td>
                      <td>₹{(order.totalAmount || 0).toFixed(2)}</td>
                      <td><span className={`status-badge status-${order.status}`}>{order.status}</span></td>
                      <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Users Table */}
          {reportType === 'users' && data.users && data.users.length > 0 && (
            <div className="table-wrapper">
              <h3 className="chart-title">User Activity Details</h3>
              <table className="data-table">
                <thead>
                  <tr><th>Customer</th><th>Email</th><th>Total Orders</th><th>Total Spent</th><th>Last Order</th></tr>
                </thead>
                <tbody>
                  {data.users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name || 'N/A'}</td>
                      <td>{u.email || 'N/A'}</td>
                      <td>{u.totalOrders}</td>
                      <td>₹{(u.totalSpent || 0).toFixed(2)}</td>
                      <td>{u.lastOrder ? new Date(u.lastOrder).toLocaleDateString('en-IN') : 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminReport;
