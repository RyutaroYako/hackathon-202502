import { useState } from 'react';
import { Book } from '../types';
import { recordSale } from '../api';
import { toast } from 'react-hot-toast';

interface SaleFormProps {
  books: Book[];
  onSaleRecorded: () => void;
}

const SaleForm = ({ books, onSaleRecorded }: SaleFormProps) => {
  const [formData, setFormData] = useState({
    bookId: '',
    quantity: '1'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.bookId || !formData.quantity) {
      toast.error('Please select a book and quantity');
      return;
    }

    try {
      setLoading(true);
      const response = await recordSale(formData.bookId, Number(formData.quantity));

      toast.success('Sale recorded successfully');

      if (response.isLowStock) {
        toast.error(`Warning: Stock for this book is now below threshold (${response.updatedStock} remaining)`);
      }

      setFormData({
        bookId: '',
        quantity: '1'
      });

      onSaleRecorded();
    } catch (error: any) {
      if (error.response?.data?.message === 'Insufficient stock') {
        toast.error('Insufficient stock for this sale');
      } else {
        toast.error('Failed to record sale');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Filter out books with zero stock
  const availableBooks = books.filter(book => book.stock > 0);

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Record Sale</h2>

      {availableBooks.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No books available for sale</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="bookId">
              Book
            </label>
            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">Select a book</option>
              {availableBooks.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} - ${book.price.toFixed(2)} ({book.stock} in stock)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="quantity">
              Quantity
            </label>
            <input
              type="number"
              id="quantity"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              className="input"
              min="1"
              max={formData.bookId ? books.find(b => b.id === formData.bookId)?.stock || 1 : 1}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={loading || !formData.bookId}
          >
            {loading ? 'Processing...' : 'Record Sale'}
          </button>
        </form>
      )}
    </div>
  );
};

export default SaleForm;