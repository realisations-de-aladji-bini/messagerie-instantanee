import { useState, useRef, useEffect } from 'react'; 
import Field from '../components/Field'
import { host } from "../utilities/apis"

function Register({setRegisteredLogin}){
  const [erreurMessage, setErreurMessage] = useState("")
  const loginRef = useRef(null)
  const passwordRef1 = useRef(null)
  const passwordRef2 = useRef(null)
  const nameRef = useRef(null)

  async function register(name, email, password){
    const response = await (await fetch(host + "register", 
      {
        method:'POST',
        headers:{'Content-type':'application/json'},
        body: JSON.stringify({email,password,name})
      })).json()
    if (!response.status){
        setErreurMessage(response.message)
    }
  }

  function verifie(){
    let message=''
    if (nameRef.current.value.length < 1) {
        message += " Vous devez spécifier un nom."
    }
    else if (!loginRef.current.value.match(/[a-z0-9]{3,10}/)) {
      message += " Le login est incorrect."
    }
    else if (passwordRef1.current.value.length < 6) {
      message += " Mot de passe trop court."
    }
    else if (passwordRef1.current.value != passwordRef2.current.value){
        message += " Mot de passe différent"
    }
    setErreurMessage(message)
    
    return (message.length===0)
  }


  function handleRegister() {
    if (verifie()) {
        register(nameRef.current.value,loginRef.current.value, passwordRef1.current.value)
        setRegisteredLogin(loginRef.current.value)
        nameRef.current.value=''
        loginRef.current.value=''
        passwordRef1.current.value=''
        passwordRef2.current.value=''
    }
  }
  return (
    <Field title='Pas encore de compte ? Enregistrez vous' handleSubmit={handleRegister} errorMessage={erreurMessage} className={'register'}>
        <label>Nom</label>
        <input ref={nameRef} type="text" placeholder={'Prénom Nom '} onChange={verifie} className='name'/>
        <label>Email</label>
        <input ref={loginRef} type="text" placeholder={'moncourriel@gmail.com'} onChange={verifie} className='email' />
        <label>Mot de Passe</label>
        <input ref={passwordRef1} type="password" placeholder={'Je$uis1P@ssF0rt'} onChange={verifie} className='password'/>
        <label>Confirmez votre Mot de Passe</label>
        <input ref={passwordRef2} type="password" placeholder={'Je$uis1P@ssF0rt'} onChange={verifie} className='confirmPassword'/>
    </Field>
  )
}

export default Register
