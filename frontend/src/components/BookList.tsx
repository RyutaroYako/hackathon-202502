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
      toast.success('書籍情報を更新しました');
      setEditingBook(null);
      onUpdate();
    } catch (error) {
      toast.error('書籍情報の更新に失敗しました');
      console.error(error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('この本を削除してもよろしいですか？')) return;

    try {
      await deleteBook(id);
      toast.success('書籍を削除しました');
      onUpdate();
    } catch (error) {
      toast.error('書籍の削除に失敗しました');
      console.error(error);
    }
  };

  if (books.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-500 text-center py-4">登録された書籍がありません</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-xl font-semibold mb-4">書籍在庫一覧</h2>
      <div className="overflow-x-auto rounded-lg shadow-lg">
        <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
          <thead style={{ backgroundColor: '#206AF4', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
            <tr className="border-b-2 border-white">
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white tracking-wider">
                タイトル
              </th>
              {!compact && (
                <>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white tracking-wider">
                    著者
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white tracking-wider">
                    価格
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white tracking-wider">
                    ISBN
                  </th>
                </>
              )}
              <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white tracking-wider">
                在庫数
              </th>
              {!compact && (
                <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-white tracking-wider">
                  閾値
                </th>
              )}
              <th scope="col" className="px-6 py-4 text-right text-xs font-medium text-white tracking-wider">
                操作
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {books.map(book => (
              <tr key={book.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{book.title}</div>
                </td>
                {!compact && (
                  <>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.author}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-500">${book.price.toFixed(2)}</div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{book.isbn}</div>
                    </td>
                  </>
                )}
                <td className="px-6 py-5 whitespace-nowrap">
                  <div className={`text-sm font-medium ${book.stock <= book.threshold ? 'text-red-600' : 'text-gray-900'}`}>
                    {book.stock}
                  </div>
                </td>
                {!compact && (
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{book.threshold}</div>
                  </td>
                )}
                <td className="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
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
                      <button type="submit" className="text-white px-2 py-1 rounded" style={{ backgroundColor: '#206AF4' }}>
                        保存
                      </button>
                      <button type="button" onClick={() => setEditingBook(null)} className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded">
                        キャンセル
                      </button>
                    </form>
                  ) : (
                    <div className="flex space-x-2 justify-end">
                      <button onClick={() => handleEdit(book)} className="text-white px-2 py-1 rounded" style={{ backgroundColor: '#206AF4' }}>
                        編集
                      </button>
                      <button onClick={() => handleDelete(book.id)} className="text-white px-2 py-1 rounded bg-red-600 hover:bg-red-700">
                        削除
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