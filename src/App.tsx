import { useState } from 'react'
import CanvasBoard from './components/CanvasBoard'
import { Avatar } from './components/Avatar'


function App() {
  const [count, setCount] = useState(0)

  return (
    <>

      <CanvasBoard />
      <Avatar />
    </>
  )
}

export default App