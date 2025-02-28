import { useState } from 'react';
import { Book } from '../types';
import { deleteBook, updateBook } from '../api';
import { toast } from 'react-hot-toast';

interface BookListProps {
  books: Book[];
  onUpdate: () => void;
  compact?: boolean;
}

const BookList = ({ books, onUpdate, compact = false }: BookListProps) => {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [editFormData, setEditFormData] = useState({
    stock: '',
    threshold: ''
  });

  const handleEdit = (book: Book) => {
    setEditingBook(book);
    setEditFormData({
      stock: book.stock.toString(),
      threshold: book.threshold.toString()
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    try {
      await updateBook(editingBook.id, {
        stock: Number(editFormData.stock),
        threshold: Number(editFormData.threshold)
      });
      toast.success('Book updated successfully');
      setEditingBook(null);
      onUpdate();
    } catch (error) {
      toast.error('Failed to update book');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this book?')) return;

    try {
      await deleteBook(id);
      toast.success('Book deleted successfully');
      onUpdate();
    } catch (error) {
      toast.error('Failed to delete book');
      console.error(error);
    }
  };

  if (books.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center py-4">No books available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">Book Inventory</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              {!compact && (
                <>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Author
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ISBN
                  </th>
                </>
              )}
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              {!compact && (
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Threshold
                </th>
              )}
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map(book => (
              <tr key={book.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                </td>
                {!compact && (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">${book.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.isbn}</div>
                    </td>
                  </>
                )}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className={`text-sm font-medium ${book.stock <= book.threshold ? 'text-red-600' : 'text-gray-900'}`}>
                    {book.stock}
                  </div>
                </td>
                {!compact && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.threshold}</div>
                  </td>
                )}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingBook?.id === book.id ? (
                    <form onSubmit={handleUpdate} className="flex space-x-2">
                      <input
                        type="number"
                        name="stock"
                        value={editFormData.stock}
                        onChange={handleChange}
                        className="w-16 p-1 border border-gray-300 rounded"
                        min="0"
                        required
                      />
                      {!compact && (
                        <input
                          type="number"
                          name="threshold"
                          value={editFormData.threshold}
                          onChange={handleChange}
                          className="w-16 p-1 border border-gray-300 rounded"
                          min="0"
                          required
                        />
                      )}
                      <button type="submit" className="text-blue-600 hover:text-blue-900">
                        Save
                      </button>
                      <button type="button" onClick={() => setEditingBook(null)} className="text-gray-600 hover:text-gray-900">
                        Cancel
                      </button>
                    </form>
                  ) : (
                    <div className="flex space-x-2 justify-end">
                      <button onClick={() => handleEdit(book)} className="text-blue-600 hover:text-blue-900">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookList;