import { useContext, useRef } from "react"
import Button from "./Button"
import { TokenContext } from "../ConnectionContext"
import { host} from "../utilities/apis"
import '../css/GroupInfo.css'



function MemberAdder({onUserAdded,groupId,users,title}) {
    const { token } = useContext(TokenContext)
    const memberRef = useRef(null)

    async function addMember(userId){
        const response = await (await fetch(host + "api/mygroups/"+groupId+"/"+userId, 
          {
            method:'PUT',
            headers:{'Content-type':'application/json', 'x-access-token':token},
          })).json()
          if (response.status) {
            onUserAdded()
          }
    }

    function handleAdd(){
        if(memberRef.current && memberRef.current.value!=""){
            addMember(memberRef.current.value)
        }
    }

    return (    
        <div className="memberAdder">
            <h4>{title}</h4>
            <div className="member-add-controls">
                <select ref={memberRef}>
                    {users.map( (user,indice) => <option key={indice} value={user.id}>{user.name} </option> )}
                </select>
                <button className="add-member-button" onClick={handleAdd}>
                    Ajouter
                </button>
            </div>
        </div>
    )
}

export default MemberAdder