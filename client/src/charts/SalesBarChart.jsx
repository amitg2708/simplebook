import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SalesBarChart = ({ data }) => {
  const chartData = data?.map((item) => ({
    month: `${MONTHS[(item._id?.month || 1) - 1]} ${item._id?.year || ''}`,
    Revenue: Math.round(item.revenue || 0),
    Orders: item.orders || 0,
  })) || [];

  return (
    <div className="chart-card">
      <h3 className="chart-title">📊 Monthly Sales Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <Tooltip formatter={(val, name) => [name === 'Revenue' ? `₹${val}` : val, name]} />
          <Legend />
          <Bar dataKey="Revenue" fill="#6366f1" radius={[6, 6, 0, 0]} />
          <Bar dataKey="Orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SalesBarChart;
