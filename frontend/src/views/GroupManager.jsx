import { useEffect, useState, useContext } from "react"
import Container from "../components/Container"
import MemberAdder from "../components/MemberAdder"
import { TokenContext } from "../ConnectionContext"
import MembersList from "../components/MembersList"
import { host } from "../utilities/apis"

function GroupManager({group}) {
    const [members,setMembers] = useState([])
    const [admins,setAdmins] = useState([])
    const [users, setUsers] = useState([])
    const { token } = useContext(TokenContext)

    useEffect(()=>{
        if(group){
            updateMembers()
            updateAdmins()
            updateUsers()
        }
    },[group])

    const updateMembers = () => {
        fetch(host+"api/mygroups/"+group.id, {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setMembers(resp.data))
        .catch(error => {
            console.error("Error fetching groups member : "+error)
        })
    }

    const updateAdmins = () => {
        fetch(host+"api/mygroups/"+group.id+"/admins", {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setAdmins(resp.data))
        .catch(error => {
            console.error("Error fetching group admins : "+error)
        })
    }

    const updateUsers = () => {
        fetch(host+"api/users/", {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setUsers(resp.data))
        .catch(error => {
            console.error("Error fetching users : "+error)
        })
    }
    const nonMemberUsers = users.filter(user => !members.some(member => member.id === user.id));

    if(group){
        return (
            <Container title={`Administration de ${group.name}`}>
                <MemberAdder groupId={group.id} users={nonMemberUsers} onUserAdded={updateMembers} title="Ajouter un nouveau membre"/>
                <MembersList members={members} admins={admins} title="Liste des Membres" onUserRemoved={updateMembers} groupId={group.id}/>
            </Container>
    
        )
    }



}

export default GroupManager
