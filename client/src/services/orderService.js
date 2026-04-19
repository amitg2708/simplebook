import API from './api';

export const placeOrder = (data) => API.post('/orders', data);
export const getAllOrders = (params) => API.get('/orders', { params });
export const getMyOrders = () => API.get('/orders/my');
export const getOrder = (id) => API.get(`/orders/${id}`);
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { status });
