import GroupsList from "../components/GroupsList"
import { useContext, useEffect, useState } from "react";
import { TokenContext } from "../ConnectionContext";
import Container from "../components/Container";
import GroupAdder from "../components/GroupAdder"
import GroupManager from "./GroupManager";
import GroupMessage from "./GroupMessage";
import {host} from "../utilities/apis"
import '../css/Groups.css'

function Groups(){
    const  {token}  = useContext(TokenContext)
    const [adminGroups,setAdminGroups] = useState([])
    const [memberGroups,setMemberGroups] = useState([])
    const [selectedGroup, setSelectedGroup] = useState([null,null])
    
    useEffect(()=> {
        updateGroups()
    },[selectedGroup])

    const updateGroups = () => {
        fetch(host + "api/mygroups", {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setAdminGroups(resp.data))
        .catch(error => {
            console.error("Error fetching groups of which you are admin")
        })
        fetch(host + "api/groupsmember", {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setMemberGroups(resp.data))
        .catch(error => {
            console.error("Error fetching groups of which you are member")
        })
    }

    function groupInteraction() {
        if (selectedGroup[1]==='admin') {
            return (
                <GroupManager group={selectedGroup[0]} />
            )
        }
        else if (selectedGroup[1]==='member') {
            return (
                <GroupMessage group={selectedGroup[0]} />
            )
        }
        return null
    }


    return (
        <div className="groupsBox">
            <div className="groupsListBox">            
            <Container title='Mes groupe'>
                <GroupsList title = 'Ceux dont je suis membre' groups={ memberGroups} setSelectedGroup={setSelectedGroup} type='member'/>
                <GroupsList title = "Ceux que j'administre" groups={ adminGroups} setSelectedGroup={setSelectedGroup} type='admin'/>
                <GroupAdder onGroupAdded={updateGroups}/>
            </Container>
            </div>
            <div className="groupInteractionBox">
                {groupInteraction()}
            </div>
        </div>
    )
}

export default Groups
