import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import CarDetailPage from './pages/CarDetailPage'
import SearchPage from './pages/SearchPage'
import PaymentPage from './pages/PaymentPage'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/cars/:id" element={<CarDetailPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />
          {/* Weitere Routen hier hinzufügen */}
        </Routes>
      </main>
    </div>
  )
}

export default App 