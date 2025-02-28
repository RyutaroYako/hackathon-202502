import axios from 'axios';
import { Book, BooksResponse, SaleResponse } from './types';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBooks = async (): Promise<BooksResponse> => {
  const response = await api.get('/books');
  return response.data;
};

export const fetchBook = async (id: string): Promise<Book> => {
  const response = await api.get(`/books/${id}`);
  return response.data;
};

export const createBook = async (book: Omit<Book, 'id'>): Promise<Book> => {
  const response = await api.post('/books', book);
  return response.data;
};

export const updateBook = async (id: string, book: Partial<Book>): Promise<Book> => {
  const response = await api.put(`/books/${id}`, book);
  return response.data;
};

export const deleteBook = async (id: string): Promise<Book> => {
  const response = await api.delete(`/books/${id}`);
  return response.data;
};

export const recordSale = async (bookId: string, quantity: number): Promise<SaleResponse> => {
  const response = await api.post('/sales', { bookId, quantity });
  return response.data;
};

export const fetchSales = async () => {
  const response = await api.get('/sales');
  return response.data;
};

export const fetchAlerts = async () => {
  const response = await api.get('/alerts');
  return response.data;
};