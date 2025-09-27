import { useState } from 'react'
import CanvasBoard from './pages/CanvasBoard'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <CanvasBoard />
    </>
  )
}

export default App