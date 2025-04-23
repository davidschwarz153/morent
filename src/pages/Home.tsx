import React, { useState, useEffect } from 'react'

export default function Home() {
  const [data, setData] = useState<{ message: string }>({ message: 'Willkommen bei Morent!' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Beispiel für Datenabfrage mit fetch
    const fetchData = async () => {
      try {
        setLoading(true)
        // Hier würde normalerweise eine API-Anfrage erfolgen
        // Beispiel:
        // const response = await fetch('https://api.example.com/data')
        // const result = await response.json()
        // setData(result)
        
        // Simuliere eine erfolgreiche Antwort
        setTimeout(() => {
          setData({ message: 'Daten erfolgreich geladen!' })
          setLoading(false)
        }, 1000)
      } catch (error) {
        console.error('Fehler beim Laden der Daten:', error)
        setLoading(false)
      }
    }

    // fetchData() - Auskommentiert, um unnötige Aufrufe zu vermeiden
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Morent Home</h1>
      
      {loading ? (
        <p>Daten werden geladen...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <p>{data.message}</p>
        </div>
      )}
    </div>
  )
} 