import { useState } from 'react';
import { Book } from '../types';
import { recordSale } from '../api';
import { toast } from 'react-hot-toast';
import { FaShoppingCart, FaBook, FaPlus, FaInfoCircle } from 'react-icons/fa';

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
      toast.error('本と数量を選択してください');
      return;
    }

    try {
      setLoading(true);
      const response = await recordSale(formData.bookId, Number(formData.quantity));

      toast.success('売上を正常に記録しました');

      if (response.isLowStock) {
        toast.error(`アラート: この本の在庫が閾値を下回りました (残り${response.updatedStock}冊)`);
      }

      setFormData({
        bookId: '',
        quantity: '1'
      });

      onSaleRecorded();
    } catch (error: any) {
      if (error.response?.data?.message === 'Insufficient stock') {
        toast.error('在庫が不足しています');
      } else {
        toast.error('売上の記録に失敗しました');
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
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaShoppingCart className="mr-2 text-blue-600" size={20} /> 売上を記録
      </h2>

      {availableBooks.length === 0 ? (
        <p className="text-gray-500 text-center py-4 flex flex-col items-center">
          <FaInfoCircle className="text-blue-500 mb-2" size={24} />
          売却可能な本がありません
        </p>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="bookId">
              <FaBook className="mr-1 text-blue-600" /> 本
            </label>
            <select
              id="bookId"
              name="bookId"
              value={formData.bookId}
              onChange={handleChange}
              className="input"
              required
            >
              <option value="">本を選択</option>
              {availableBooks.map(book => (
                <option key={book.id} value={book.id}>
                  {book.title} - ¥{book.price.toFixed(2)} (在庫: {book.stock}冊)
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="quantity">
              <FaPlus className="mr-1 text-blue-600" /> 数量
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
            {loading ? '処理中...' : <span className="flex items-center justify-center"><FaShoppingCart className="mr-2" /> 売上を記録</span>}
          </button>
        </form>
      )}
    </div>
  );
};

export default SaleForm;
