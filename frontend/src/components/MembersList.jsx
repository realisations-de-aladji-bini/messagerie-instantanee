import { useContext } from 'react'
import { TokenContext } from '../ConnectionContext'
import Button from './Button'
import { host} from "../utilities/apis"



function MembersList({title, members, groupId, onUserRemoved}){
    const { token } = useContext(TokenContext)

    async function removeMember(userId) {
        console.log(userId,groupId)
        const response = await (await fetch(host + "api/mygroups/"+groupId+"/"+userId, 
        {
          method:'DELETE',
          headers:{'Content-type':'application/json', 'x-access-token':token},
        })).json()
        console.log(response)
        if (response.status) {
          onUserRemoved()
        }
        onUserRemoved()
    }


    return (
        <div className="membersListBox">
            <h5>{title}</h5>
            <ul className="membersList">
                { members.minLength !== 0 ? 
                members.map((member,indice) => (
                    <li key={indice}>{member.name} <Button title="Supprimer" clickFonction={()=> {const isConfirmed = window.confirm(`Êtes-vous sûr de vouloir supprimer ${member.name} du groupe ?`); if (isConfirmed) {removeMember(member.id)}}}/></li>
                )) 
                : "Aucun élément" }
            </ul>
        </div>
    )
}

export default MembersList
