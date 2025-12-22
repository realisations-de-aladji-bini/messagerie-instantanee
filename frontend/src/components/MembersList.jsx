import { useContext } from 'react'
import { TokenContext, UserContext } from '../ConnectionContext'
import Button from './Button'
import { host} from "../utilities/apis"
import '../css/GroupInfo.css'



function MembersList({title, members, groupId, onUserRemoved, admins = []}){
    const { token } = useContext(TokenContext)
    const { user } = useContext(UserContext)

    async function removeMember(userId, memberName, realName) {
        const confirmMessage = memberName === 'Vous' 
            ? `Êtes-vous sûr de vouloir vous retirer du groupe ?`
            : `Êtes-vous sûr de vouloir supprimer ${realName} du groupe ?`
        
        const isConfirmed = window.confirm(confirmMessage)
        if (!isConfirmed) {
            return
        }
        
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

    function isAdmin(userId) {
        return admins.some(admin => admin.id === userId)
    }

    function getSortedMembers() {
        return [...members].sort((a, b) => {
            if (a.id === user.id) return -1
            if (b.id === user.id) return 1
            return 0
        })
    }

    return (
        <div className="membersListBox">
            <h4>{title}</h4>
            <ul className="members-list">
                { members.minLength !== 0 ? 
                getSortedMembers().map((member,indice) => {
                    const displayName = member.id === user.id ? 'Vous' : member.name
                    const memberIsAdmin = isAdmin(member.id)
                    const isCurrentUser = member.id === user.id
                    return (
                        <li key={indice}>
                            <div>
                                <span className="member-name">{displayName}</span>
                                {memberIsAdmin && <span className="admin-badge">Admin</span>}
                            </div>
                            {!memberIsAdmin && !isCurrentUser && (
                                <button className="remove-member-btn" onClick={() => removeMember(member.id, displayName, member.name)}>
                                    Supprimer
                                </button>
                            )}
                        </li>
                    )
                }) 
                : "Aucun élément" }
            </ul>
        </div>
    )
}

export default MembersList
