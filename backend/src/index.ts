import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import { Pool } from 'pg';

// Initialize Express app
const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgres://bookstore:bookstore123@localhost:5432/bookstore_inventory'
});

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
  book_id: string;
  quantity: number;
  total_amount: number;
  date: string;
}

// Helper function to check if a book is below threshold
const checkBookThreshold = (book: Book): boolean => {
  return book.stock <= book.threshold;
};

// Database connection test
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('Database connection error:', err);
  } else {
    console.log('Database connected successfully at:', res.rows[0].now);
  }
});

// API Routes

// Helper function to convert PostgreSQL numeric strings to JavaScript numbers
const convertBookData = (book: any): Book => {
  return {
    ...book,
    price: Number(book.price),
    stock: Number(book.stock),
    threshold: Number(book.threshold)
  };
};

// Get all books
app.get('/api/books', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM books ORDER BY title');
    const books = result.rows.map(convertBookData);

    const alerts = books.filter(checkBookThreshold).map(book => ({
      id: book.id,
      title: book.title,
      stock: book.stock,
      threshold: book.threshold
    }));

    res.json({ books, alerts });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific book
app.get('/api/books/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(convertBookData(result.rows[0]));
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add a new book
app.post('/api/books', async (req: Request, res: Response) => {
  try {
    const { title, author, price, isbn, stock, threshold } = req.body;

    if (!title || !author || !price || !isbn || stock === undefined) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const id = uuidv4();
    const defaultThreshold = threshold || 5;

    const result = await pool.query(
      'INSERT INTO books (id, title, author, price, isbn, stock, threshold) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [id, title, author, Number(price), isbn, Number(stock), Number(defaultThreshold)]
    );

    res.status(201).json(convertBookData(result.rows[0]));
  } catch (error: any) {
    console.error('Error adding book:', error);

    // Check for duplicate ISBN error
    if (error.code === '23505' && error.constraint === 'books_isbn_key') {
      return res.status(400).json({ message: 'ISBN already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Update a book
app.put('/api/books/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, author, price, isbn, stock, threshold } = req.body;

    // First check if the book exists
    const checkResult = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const currentBook = checkResult.rows[0];

    // Build the update query dynamically
    const updates = [];
    const values = [id];
    let paramIndex = 2;

    if (title) {
      updates.push(`title = $${paramIndex}`);
      values.push(title);
      paramIndex++;
    }

    if (author) {
      updates.push(`author = $${paramIndex}`);
      values.push(author);
      paramIndex++;
    }

    if (price) {
      updates.push(`price = $${paramIndex}`);
      values.push(Number(price).toString());
      paramIndex++;
    }

    if (isbn) {
      updates.push(`isbn = $${paramIndex}`);
      values.push(isbn);
      paramIndex++;
    }

    if (stock !== undefined) {
      updates.push(`stock = $${paramIndex}`);
      values.push(Number(stock).toString());
      paramIndex++;
    }

    if (threshold) {
      updates.push(`threshold = $${paramIndex}`);
      values.push(Number(threshold).toString());
      paramIndex++;
    }

    if (updates.length === 0) {
      return res.status(400).json({ message: 'No fields to update' });
    }

    const updateQuery = `UPDATE books SET ${updates.join(', ')} WHERE id = $1 RETURNING *`;
    const result = await pool.query(updateQuery, values);

    res.json(convertBookData(result.rows[0]));
  } catch (error: any) {
    console.error('Error updating book:', error);

    // Check for duplicate ISBN error
    if (error.code === '23505' && error.constraint === 'books_isbn_key') {
      return res.status(400).json({ message: 'ISBN already exists' });
    }

    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a book
app.delete('/api/books/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // First check if the book exists
    const checkResult = await pool.query('SELECT * FROM books WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    const result = await pool.query('DELETE FROM books WHERE id = $1 RETURNING *', [id]);

    res.json(convertBookData(result.rows[0]));
  } catch (error: any) {
    console.error('Error deleting book:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to convert PostgreSQL numeric strings to JavaScript numbers for sales
const convertSaleData = (sale: any): any => {
  return {
    ...sale,
    quantity: Number(sale.quantity),
    total_amount: Number(sale.total_amount)
  };
};

// Record a sale
app.post('/api/sales', async (req: Request, res: Response) => {
  try {
    const { bookId, quantity } = req.body;

    if (!bookId || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Start a transaction
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      // Get the book
      const bookResult = await client.query('SELECT * FROM books WHERE id = $1', [bookId]);

      if (bookResult.rows.length === 0) {
        await client.query('ROLLBACK');
        return res.status(404).json({ message: 'Book not found' });
      }

      const book = convertBookData(bookResult.rows[0]);

      if (book.stock < quantity) {
        await client.query('ROLLBACK');
        return res.status(400).json({ message: 'Insufficient stock' });
      }

      // Update book stock
      const updatedStock = book.stock - quantity;
      await client.query('UPDATE books SET stock = $1 WHERE id = $2', [updatedStock.toString(), bookId]);

      // Record the sale
      const saleId = uuidv4();
      const totalAmount = book.price * Number(quantity);

      const saleResult = await client.query(
        'INSERT INTO sales (id, book_id, quantity, total_amount) VALUES ($1, $2, $3, $4) RETURNING *',
        [saleId, bookId, Number(quantity).toString(), totalAmount.toString()]
      );

      await client.query('COMMIT');

      const isLowStock = updatedStock <= book.threshold;

      res.status(201).json({
        sale: convertSaleData(saleResult.rows[0]),
        updatedStock,
        isLowStock
      });
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error: any) {
    console.error('Error recording sale:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all sales
app.get('/api/sales', async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT s.*, b.title as book_title
      FROM sales s
      JOIN books b ON s.book_id = b.id
      ORDER BY s.date DESC
    `);

    res.json(result.rows.map(convertSaleData));
  } catch (error: any) {
    console.error('Error fetching sales:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get alerts for books below threshold
app.get('/api/alerts', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, title, stock, threshold FROM books WHERE stock <= threshold');

    const alerts = result.rows.map(alert => ({
      id: alert.id,
      title: alert.title,
      stock: Number(alert.stock),
      threshold: Number(alert.threshold)
    }));

    res.json(alerts);
  } catch (error: any) {
    console.error('Error fetching alerts:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;