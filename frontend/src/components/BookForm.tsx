import { useState } from 'react';
import { createBook } from '../api';
import { toast } from 'react-hot-toast';
import { FaPlus, FaBook, FaUser, FaMoneyBillWave, FaBarcode, FaBoxOpen, FaBell } from 'react-icons/fa';

interface BookFormProps {
  onBookAdded: () => void;
}

const BookForm = ({ onBookAdded }: BookFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    price: '',
    isbn: '',
    stock: '',
    threshold: '5'
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.author || !formData.price || !formData.isbn || !formData.stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      await createBook({
        title: formData.title,
        author: formData.author,
        price: Number(formData.price),
        isbn: formData.isbn,
        stock: Number(formData.stock),
        threshold: Number(formData.threshold)
      });

      toast.success('Book added successfully');
      setFormData({
        title: '',
        author: '',
        price: '',
        isbn: '',
        stock: '',
        threshold: '5'
      });
      onBookAdded();
    } catch (error) {
      toast.error('Failed to add book');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <FaPlus className="mr-2 text-blue-600" size={18} /> 新しい本を追加
      </h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="title">
            <FaBook className="mr-1 text-blue-600" /> タイトル
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="input"
            placeholder="本のタイトル"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="author">
            <FaUser className="mr-1 text-blue-600" /> 著者
          </label>
          <input
            type="text"
            id="author"
            name="author"
            value={formData.author}
            onChange={handleChange}
            className="input"
            placeholder="著者名"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="price">
            <FaMoneyBillWave className="mr-1 text-blue-600" /> 価格
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="input"
            placeholder="価格"
            min="0"
            step="0.01"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="isbn">
            <FaBarcode className="mr-1 text-blue-600" /> ISBN
          </label>
          <input
            type="text"
            id="isbn"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            className="input"
            placeholder="ISBN コード"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="stock">
            <FaBoxOpen className="mr-1 text-blue-600" /> 在庫数
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            className="input"
            placeholder="在庫数"
            min="0"
            required
          />
        </div>

        <div className="mb-4">
          <label className="text-gray-700 text-sm font-bold mb-2 flex items-center" htmlFor="threshold">
            <FaBell className="mr-1 text-blue-600" /> アラート閾値
          </label>
          <input
            type="number"
            id="threshold"
            name="threshold"
            value={formData.threshold}
            onChange={handleChange}
            className="input"
            placeholder="アラート閾値"
            min="0"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? '追加中...' : <span className="flex items-center justify-center"><FaPlus className="mr-2" /> 本を追加</span>}
        </button>
      </form>
    </div>
  );
};

export default BookForm;
