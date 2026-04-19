import API from './api';

export const getSalesReport = (params) => API.get('/reports/sales', { params });
export const getOrdersReport = (params) => API.get('/reports/orders', { params });
export const getUserReport = () => API.get('/reports/users');
