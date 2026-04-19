import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const RevenueLineChart = ({ data }) => {
  const chartData = data?.map((item) => ({
    month: `${MONTHS[(item._id?.month || 1) - 1]}`,
    Revenue: Math.round(item.revenue || 0),
  })) || [];

  return (
    <div className="chart-card">
      <h3 className="chart-title">📈 Revenue Growth Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="month" tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <YAxis tick={{ fill: 'var(--text-secondary)', fontSize: 12 }} />
          <Tooltip formatter={(val) => [`₹${val}`, 'Revenue']} />
          <Legend />
          <Line
            type="monotone"
            dataKey="Revenue"
            stroke="#6366f1"
            strokeWidth={3}
            dot={{ fill: '#6366f1', r: 5 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RevenueLineChart;
