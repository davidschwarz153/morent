import { useState, useEffect } from 'react'
import axios from 'axios'
import { supabase } from '../lib/supabase'

function Home() {
  const [data, setData] = useState<any>(null)

  useEffect(() => {
    // Beispiel für Axios-Aufruf
    async function fetchData() {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1')
        setData(response.data)
      } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Mein React-Projekt</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Daten von API:</h2>
          {data ? (
            <pre className="bg-gray-100 p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
          ) : (
            <p>Lade Daten...</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Home 