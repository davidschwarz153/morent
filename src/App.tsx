import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* Weitere Routen hier hinzufügen */}
    </Routes>
  )
}

export default App 