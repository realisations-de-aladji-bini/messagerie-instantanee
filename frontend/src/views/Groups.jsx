import GroupsList from "../components/GroupsList"
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate, Routes, Route } from "react-router-dom";
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
    const navigate = useNavigate()
    
    useEffect(()=> {
        updateGroups()
    },[])

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

    const setSelectedGroup = (group) => {
        if (group[0] && group[1]) {
            navigate(`/groups/${group[1]}/${group[0].id}`)
        }
    }


    return (
        <div className="groupsBox">
            <div className="groupsListBox">            
            <Container title='Tous mes groupes'>
                <div className="container-content">
                    <GroupsList title = 'Ceux dont je suis membre' groups={ memberGroups} setSelectedGroup={setSelectedGroup} type='member'/>
                    <GroupsList title = "Ceux que j'administre" groups={ adminGroups} setSelectedGroup={setSelectedGroup} type='admin'/>
                </div>
                <GroupAdder onGroupAdded={updateGroups}/>
            </Container>
            </div>
            <div className="groupInteractionBox">
                <Routes>
                    <Route path="admin/:groupId" element={<GroupManagerWrapper adminGroups={adminGroups} />} />
                    <Route path="member/:groupId" element={<GroupMessageWrapper memberGroups={memberGroups} />} />
                    <Route path="/" element={<EmptyGroupView />} />
                </Routes>
            </div>
        </div>
    )
}

function GroupManagerWrapper({ adminGroups }) {
    const { groupId } = useParams()
    const group = adminGroups.find(g => g.id === parseInt(groupId))
    return group ? <GroupManager group={group} /> : null
}

function GroupMessageWrapper({ memberGroups }) {
    const { groupId } = useParams()
    const group = memberGroups.find(g => g.id === parseInt(groupId))
    return group ? <GroupMessage group={group} /> : null
}

function EmptyGroupView() {
    return (
        <div className="empty-group-view">
            <div className="empty-group-message">
                <p>Sélectionnez un groupe dans la barre latérale de gauche ou créez-en un pour discuter</p>
            </div>
        </div>
    )
}

export default Groups
