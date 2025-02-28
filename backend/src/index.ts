import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

// Initialize Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Types
interface Book {
  id: string;
  title: string;
  author: string;
  price: number;
  isbn: string;
  stock: number;
  threshold: number;
}

interface Sale {
  id: string;
  bookId: string;
  quantity: number;
  totalAmount: number;
  date: string;
}

// In-memory database
let books: Book[] = [];
let sales: Sale[] = [];

// Helper function to check if a book is below threshold
const checkBookThreshold = (book: Book): boolean => {
  return book.stock <= book.threshold;
};

// API Routes

// Get all books
app.get('/api/books', (req: Request, res: Response) => {
  res.json({
    books,
    alerts: books.filter(checkBookThreshold).map(book => ({
      id: book.id,
      title: book.title,
      stock: book.stock,
      threshold: book.threshold
    }))
  });
});

// Get a specific book
app.get('/api/books/:id', (req: Request, res: Response) => {
  const book = books.find(b => b.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// Add a new book
app.post('/api/books', (req: Request, res: Response) => {
  const { title, author, price, isbn, stock, threshold } = req.body;

  if (!title || !author || !price || !isbn || stock === undefined) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const newBook: Book = {
    id: uuidv4(),
    title,
    author,
    price: Number(price),
    isbn,
    stock: Number(stock),
    threshold: Number(threshold) || 5 // Default threshold
  };

  books.push(newBook);
  res.status(201).json(newBook);
});

// Update a book
app.put('/api/books/:id', (req: Request, res: Response) => {
  const { title, author, price, isbn, stock, threshold } = req.body;
  const bookIndex = books.findIndex(b => b.id === req.params.id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  books[bookIndex] = {
    ...books[bookIndex],
    ...(title && { title }),
    ...(author && { author }),
    ...(price && { price: Number(price) }),
    ...(isbn && { isbn }),
    ...(stock !== undefined && { stock: Number(stock) }),
    ...(threshold && { threshold: Number(threshold) })
  };

  res.json(books[bookIndex]);
});

// Delete a book
app.delete('/api/books/:id', (req: Request, res: Response) => {
  const bookIndex = books.findIndex(b => b.id === req.params.id);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const deletedBook = books.splice(bookIndex, 1)[0];
  res.json(deletedBook);
});

// Record a sale
app.post('/api/sales', (req: Request, res: Response) => {
  const { bookId, quantity } = req.body;

  if (!bookId || !quantity) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const book = books.find(b => b.id === bookId);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (book.stock < quantity) {
    return res.status(400).json({ message: 'Insufficient stock' });
  }

  // Update book stock
  book.stock -= quantity;

  // Record the sale
  const newSale: Sale = {
    id: uuidv4(),
    bookId,
    quantity: Number(quantity),
    totalAmount: book.price * Number(quantity),
    date: new Date().toISOString()
  };

  sales.push(newSale);

  res.status(201).json({
    sale: newSale,
    updatedStock: book.stock,
    isLowStock: checkBookThreshold(book)
  });
});

// Get all sales
app.get('/api/sales', (req: Request, res: Response) => {
  res.json(sales);
});

// Get alerts for books below threshold
app.get('/api/alerts', (req: Request, res: Response) => {
  const alerts = books.filter(checkBookThreshold).map(book => ({
    id: book.id,
    title: book.title,
    stock: book.stock,
    threshold: book.threshold
  }));

  res.json(alerts);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);

  // Add some sample data
  if (books.length === 0) {
    books = [
      {
        id: uuidv4(),
        title: "The Great Gatsby",
        author: "F. Scott Fitzgerald",
        price: 12.99,
        isbn: "9780743273565",
        stock: 15,
        threshold: 5
      },
      {
        id: uuidv4(),
        title: "To Kill a Mockingbird",
        author: "Harper Lee",
        price: 14.99,
        isbn: "9780061120084",
        stock: 8,
        threshold: 5
      },
      {
        id: uuidv4(),
        title: "1984",
        author: "George Orwell",
        price: 11.99,
        isbn: "9780451524935",
        stock: 3,
        threshold: 5
      }
    ];
    console.log("Sample data loaded");
  }
});

export default app;