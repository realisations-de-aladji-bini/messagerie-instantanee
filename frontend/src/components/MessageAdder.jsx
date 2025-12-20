import { useContext, useRef } from "react"
import Button from "./Button"
import { TokenContext } from "../ConnectionContext"
import { host} from "../utilities/apis"

function MessageAdder({onMessageAdded, groupId}){
    const { token } = useContext(TokenContext)
    const messageRef = useRef(null)

    async function addMessage(content){
        const response = await (await fetch(host + "api/messages/"+groupId, 
          {
            method:'POST',
            headers:{'Content-type':'application/json', 'x-access-token':token},
            body: JSON.stringify({content})
          })).json()
          if (response.status) {
            onMessageAdded()
          }
    }

    function handleAdd(){
        if(messageRef.current && messageRef.current.value!=='' ){
            addMessage(messageRef.current.value)
        }
        messageRef.current.value=''
    }

    function handleKeyDown(e){
        if(e.key === 'Enter'){
            handleAdd()
        }
    }


    return (
        <div className="messageAdder">
            <input ref={messageRef} type="text" placeholder='Saisissez votre nouveau message ici' onKeyDown={handleKeyDown}/>
            <Button title={"Envoyer le message"} clickFonction={handleAdd} />
        </div>
    )

}

export default MessageAdder
