import API from './api';

export const getBooks = (params) => API.get('/books', { params });
export const getBook = (id) => API.get(`/books/${id}`);
export const getCategories = () => API.get('/books/categories');
export const createBook = (data) => API.post('/books', data);
export const updateBook = (id, data) => API.put(`/books/${id}`, data);
export const deleteBook = (id) => API.delete(`/books/${id}`);
