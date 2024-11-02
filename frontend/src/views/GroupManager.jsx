import { useEffect, useState, useContext } from "react"
import Container from "../components/Container"
import MemberAdder from "../components/MemberAdder"
import { TokenContext, UserContext } from "../ConnectionContext"
import MembersList from "../components/MembersList"
import { host } from "../utilities/apis"

function GroupManager({group}) {
    const [members,setMembers] = useState([])
    const [users, setUsers] = useState([])
    const { token } = useContext(TokenContext)

    useEffect(()=>{
        if(group){
            updateMembers()
            updateUsers()
        }
    },[group])

    const updateMembers = () => {
        fetch(host+"api/mygroups/"+group.id, {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setMembers(resp.data))
        .catch(error => {
            console.error("Error fetching groups member")
        })
    }

    const updateUsers = () => {
        fetch(host+"api/users/", {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setUsers(resp.data))
        .catch(error => {
            console.error("Error fetching users")
        })
    }
    const nonMemberUsers = users.filter(user => !members.some(member => member.id === user.id));

    if(group){
        return (
            <Container title={`Administration de "${group.name}"`}>
                <MemberAdder groupId={group.id} users={nonMemberUsers} onUserAdded={updateMembers} title="Ajouter un membre"/>
                <MembersList members={members} title="Liste des Membres" onUserRemoved={updateMembers} groupId={group.id}/>
            </Container>
    
        )
    }



}

export default GroupManager
