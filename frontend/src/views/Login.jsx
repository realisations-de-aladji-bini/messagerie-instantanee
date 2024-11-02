import { useState, useRef, useContext } from 'react'; 
import { TokenContext, UserContext } from '../ConnectionContext';
import { host } from "../utilities/apis"
//import 'bootstrap/dist/css/bootstrap.min.css';
import Field from '../components/Field';

function Login({preFilledLogin}){
  const {setToken} = useContext(TokenContext)
  const {setUser} = useContext(UserContext)
  const [loginMessage, setLoginMessage] = useState("")
  const loginRef = useRef(null)
  const passwordRef = useRef(null)

  async function verifLogin(email, password){
    const response = await (await fetch(host + "login", 
      {
        method:'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({email,password})
      })).json()
    setToken(response.token)
    setUser(response.user)
    setLoginMessage(response.message)
  }

  function verifie(){
    let message = ""
    if (!loginRef.current.value
          .match(/[a-z0-9]{3,10}/)) {
      message += " Le login est incorrect."
    }
    else if (passwordRef.current.value.length
          <6) {
      message += " Mot de passe trop court."
    }
    setLoginMessage(message)
    return (message.length===0)
  }

  function handleLogin() {
    if (verifie()) {
      verifLogin(loginRef.current.value, passwordRef.current.value)
    }
  }
  return (
    <Field title='Se Connecter' handleSubmit={handleLogin} errorMessage={loginMessage} className={'login'}>
      <label>Email</label>
      <input ref={loginRef} type="text" autoFocus={true} placeholder={'moncourriel@gmail.com'} onChange={verifie} value={preFilledLogin}  className='email'/>
      <label>Mot de Passe</label>
      <input ref={passwordRef} type="password" placeholder={'Je$uis1P@ssF0rt'} onChange={verifie} className='password'/>
    </Field>
  )
}

export default Login
