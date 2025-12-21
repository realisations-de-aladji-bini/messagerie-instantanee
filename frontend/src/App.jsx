import { useState, useEffect } from 'react'
import './App.css'
import Login from './views/Login'
import Accueil from './views/Accueil'

import { UserContext, TokenContext } from './ConnectionContext';
import Register from './views/Register'

function App() {
  const [token, setToken] = useState(() => {
    return localStorage.getItem('token') || undefined
  })
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : undefined
  })
  const [registeredLogin, setRegisteredLogin] = useState(undefined);

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
    } else {
      localStorage.removeItem('token')
    }
  }, [token])

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      localStorage.removeItem('user')
    }
  }, [user])

  function ConnectPannel() {
    if (token){
      return <Accueil/>
    }
    return(
        <div className='connectPannel'>
          <div className="welcome-container">
            <div className="welcome-message">
                <h2> <span className='welcome-emoji'> &#128075;</span> XChangeo</h2>
              <p> Votre application de messagerie inegalée !    <span className='happy-emoji' > &#128522;</span></p>
            </div>
          </div>
          <Login preFilledLogin={registeredLogin}/>
          <Register setRegisteredLogin={setRegisteredLogin}/>
        </div>
    )
  }

  return (
      <main>
        <TokenContext.Provider value={{token, setToken}}>
          <UserContext.Provider value={{user,setUser}}>
        <ConnectPannel />
      </UserContext.Provider>
      </TokenContext.Provider>
    </main>
  )
}

export default App
