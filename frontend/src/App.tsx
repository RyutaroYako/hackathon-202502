import { useState, useEffect } from 'react'
import { fetchBooks, fetchAlerts } from './api'
import { Book, Alert } from './types'
import BookForm from './components/BookForm'
import BookList from './components/BookList'
import SaleForm from './components/SaleForm'
import AlertList from './components/AlertList'

function App() {
  const [books, setBooks] = useState<Book[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('books')

  const loadData = async () => {
    try {
      setLoading(true)
      const data = await fetchBooks()
      setBooks(data.books)
      setAlerts(data.alerts)
    } catch (error) {
      console.error('Error loading data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const tabs = [
    { id: 'books', label: '本' },
    { id: 'sales', label: '売上記録' },
    { id: 'alerts', label: 'アラート' }
  ]

  return (
    <div>
      <header className="header mb-8" style={{ boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }}>
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl font-bold mb-2">本屋在庫管理システム</h1>
          <p className="text-white text-opacity-90">本屋での書籍の在庫を管理するためのシステムです。書籍の入庫、販売、在庫数の管理を効率化し、欠品を防ぎます。</p>
        </div>
      </header>

      <div className="container mx-auto px-4 pb-8 max-w-7xl">

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`py-4 px-6 font-medium text-sm ${activeTab === tab.id
                    ? 'border-b-2 text-white bg-opacity-90 rounded-t-lg'
                    : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100 hover:bg-opacity-50 rounded-t-lg'
                    }`}
                  style={activeTab === tab.id ? { backgroundColor: '#206AF4' } : {}}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  {tab.id === 'alerts' && alerts.length > 0 && (
                    <span className="ml-2 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                      {alerts.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">読み込み中...</p>
          </div>
        ) : (
          <div className="mt-6">
            {activeTab === 'books' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <BookList books={books} onUpdate={loadData} />
                </div>
                <div>
                  <BookForm onBookAdded={loadData} />
                </div>
              </div>
            )}

            {activeTab === 'sales' && (
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3">
                  <BookList books={books} onUpdate={loadData} compact />
                </div>
                <div>
                  <SaleForm books={books} onSaleRecorded={loadData} />
                </div>
              </div>
            )}

            {activeTab === 'alerts' && (
              <AlertList alerts={alerts} />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App
