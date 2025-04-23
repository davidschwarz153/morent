import { Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<HomePage />} />
          {/* Weitere Routen hier hinzufügen */}
        </Routes>
      </main>
    </div>
  )
}

export default App 