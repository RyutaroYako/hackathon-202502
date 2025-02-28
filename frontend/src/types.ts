export interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  isbn: string;
  stock: number;
  threshold: number;
}

export interface Sale {
  id: string;
  bookId: string;
  quantity: number;
  totalAmount: number;
  date: string;
}

export interface Alert {
  id: string;
  title: string;
  stock: number;
  threshold: number;
}

export interface BooksResponse {
  books: Book[];
  alerts: Alert[];
}

export interface SaleResponse {
  sale: Sale;
  updatedStock: number;
  isLowStock: boolean;
}