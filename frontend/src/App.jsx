import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [items, setItems] = useState([])
  const [newItem, setNewItem] = useState('')

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('http://localhost:8000/items/')
      const data = await response.json()
      setItems(data)
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  const addItem = async () => {
    if (!newItem) return
    try {
      await fetch('http://localhost:8000/items/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItem, description: 'Created from frontend' }),
      })
      setNewItem('')
      fetchItems()
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  return (
    <div className="App">
      <h1>Docker Demo</h1>
      <div className="card">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="New Item Name"
        />
        <button onClick={addItem}>Add Item</button>
      </div>
      <div className="list">
        <h2>Items List</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>{item.name}: {item.description}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default App
