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
    { id: 'books', label: 'Books' },
    { id: 'sales', label: 'Record Sale' },
    { id: 'alerts', label: 'Alerts' }
  ]

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Bookstore Inventory Management</h1>
        <p className="text-gray-600">Manage your bookstore inventory efficiently</p>
      </header>

      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            {tabs.map(tab => (
              <button
                key={tab.id}
                className={`py-4 px-6 font-medium text-sm ${activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
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
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : (
        <div className="mt-6">
          {activeTab === 'books' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <BookList books={books} onUpdate={loadData} />
              </div>
              <div>
                <BookForm onBookAdded={loadData} />
              </div>
            </div>
          )}

          {activeTab === 'sales' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
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
  )
}

export default App