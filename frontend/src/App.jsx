import { useState } from 'react'
import './App.css'
import Login from './views/Login'
import Accueil from './views/Accueil'

import { UserContext, TokenContext } from './ConnectionContext';
import Register from './views/Register'

function App() {
  const [token, setToken] = useState(undefined)
  const [user, setUser] = useState(undefined)
  const [registeredLogin, setRegisteredLogin] = useState(undefined);

  function ConnectPannel() {
    if (token){
      return <Accueil/>
    }
    return(
        <div className='connectPannel'>
          <Login preFilledLogin={registeredLogin}/>
          <Register setRegisteredLogin={setRegisteredLogin}/>
          <div className="welcome-container">
            <div className="welcome-message">
                <h2> <span className='welcome-emoji'> &#128075;</span> XChangeo</h2>
              <p> Votre application de messagerie inégalée !    <span className='happy-emoji' > &#128522;</span></p>
            </div>
          </div>
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
