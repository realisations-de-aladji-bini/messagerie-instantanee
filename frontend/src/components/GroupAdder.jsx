import { useContext, useRef } from "react"
import Button from "./Button"
import { TokenContext } from "../ConnectionContext"
import { host} from "../utilities/apis"



function GroupAdder({onGroupAdded}) {
    const { token } = useContext(TokenContext)
    const groupNameRef = useRef(null)

    async function addGroup(name){
        const response = await (await fetch(host + "api/mygroups", 
          {
            method:'POST',
            headers:{'Content-type':'application/json', 'x-access-token':token},
            body: JSON.stringify({name})
          })).json()
          if (response.status) {
            onGroupAdded()
          }
    }

    function handleAdd(){
        if(groupNameRef.current && groupNameRef.current.value!==''){
            addGroup(groupNameRef.current.value)
        }
        groupNameRef.current.value=''
    }

    return (
        <div className="groupAdder">
            <input ref={groupNameRef} type="text" placeholder='Créer un groupe' onFocus={()=>groupNameRef.current.value = ''}/>
            <Button title={"Créer"} clickFonction={handleAdd} />
        </div>
    )
}

export default GroupAdder
