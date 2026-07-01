import { useState } from 'react'
import './App.css'
import Header from './Component/Header'
import TodoPanel from './Component/TodoPanel'

function App() {

  return ( <div className='min-h-screen bg-gray-900'>
    <Header />
    <TodoPanel />
  </div>
  )
}

export default App
