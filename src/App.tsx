import { useState } from 'react'
import Login from "./components/Login.tsx";
import Phone from "./components/Phone.tsx";

function App() {
  const [auth, setAuth] = useState<boolean>(true)

  return (
    <div className={'app-container'}>
      {auth ? (
        <Phone />
      ) : (<Login setAuth={setAuth} />)}
      <div className={'main-btn'}></div>
    </div>
  )
}

export default App
