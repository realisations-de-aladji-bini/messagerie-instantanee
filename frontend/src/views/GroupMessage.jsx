import { useEffect, useState, useContext } from "react"
import Container from "../components/Container"
import { TokenContext, UserContext } from "../ConnectionContext"
import MessageAdder from "../components/MessageAdder"
import MessagesList from "../components/MessagesList"
import MemberAdder from "../components/MemberAdder"
import { host } from "../utilities/apis"
import '../css/GroupInfo.css'


function GroupMessage({group}) {
    const [messages, setMessages] = useState([])
    const [members, setMembers] = useState([])
    const [admins, setAdmins] = useState([])
    const [groupDetails, setGroupDetails] = useState(null)
    const [showGroupInfo, setShowGroupInfo] = useState(false)
    const [isEditingName, setIsEditingName] = useState(false)
    const [newGroupName, setNewGroupName] = useState('')
    const [allUsers, setAllUsers] = useState([])
    const { token } = useContext(TokenContext)
    const { user } = useContext(UserContext)

    useEffect(()=>{
        const interval = setInterval(() => {
            if (group) {
                updateMessages();
                updateMembers();
            }
        }, 5000)
        if (group) {
            updateMessages();
            updateMembers();
            updateAllUsers();
        }
        return () => clearInterval(interval)
    },[group])

    const updateMessages = () => {
        fetch(host + "api/messages/"+group.id, {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setMessages(resp.groupMessages))
        .catch(error => {
            console.error("Error fetching messages :" + error)
        })
    }

    const updateMembers = () => {
        fetch(host + "api/mygroups/"+group.id, {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setMembers(resp.data))
        .catch(error => {
            console.error("Error fetching groups member :" + error)
        })
        
        fetch(host + "api/groups/"+group.id, {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => {
            if(resp.data) {
                if(resp.data.admins) {
                    setAdmins(resp.data.admins)
                }
                setGroupDetails(resp.data)
            }
        })
        .catch(error => {
            console.error("Error fetching group admins and details :" + error)
        })
    }

    const updateAllUsers = () => {
        fetch(host + "api/users", {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => {
            const nonMembers = resp.data.filter(u => !members.some(m => m.id === u.id))
            setAllUsers(nonMembers)
        })
        .catch(error => {
            console.error("Error fetching users :" + error)
        })
    }

    const handleUpdateGroupName = async () => {
        if (!newGroupName.trim()) return
        
        try {
            const response = await fetch(host + "api/mygroups/"+group.id, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'x-access-token': token
                },
                body: JSON.stringify({ name: newGroupName })
            })
            const data = await response.json()
            if (data.status) {
                group.name = newGroupName
                setIsEditingName(false)
                setNewGroupName('')
                updateMembers()
            } else {
                alert('Erreur lors de la modification du nom: ' + (data.message || 'Erreur inconnue'))
            }
        } catch (error) {
            console.error("Error updating group name :" + error)
            alert('Erreur lors de la modification du nom')
        }
    }

    const handleRemoveMember = async (memberId) => {
        try {
            const response = await fetch(host + "api/mygroups/"+group.id+"/"+memberId, {
                method: 'DELETE',
                headers: {'x-access-token': token}
            })
            const data = await response.json()
            if (data.status) {
                updateMembers()
            }
        } catch (error) {
            console.error("Error removing member :" + error)
        }
    }

    const handleDeleteGroup = async () => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer le groupe "${group.name}" ? Cette action est irréversible.`)) {
            return
        }

        try {
            const response = await fetch(host + "api/mygroups/"+group.id, {
                method: 'DELETE',
                headers: {'x-access-token': token}
            })
            const data = await response.json()
            if (data.status) {
                window.location.href = '/groups'
            } else {
                alert('Erreur lors de la suppression du groupe: ' + (data.message || 'Erreur inconnue'))
            }
        } catch (error) {
            console.error("Error deleting group :" + error)
            alert('Erreur lors de la suppression du groupe')
        }
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function isAdmin(userId) {
        return admins.some(admin => admin.id === userId)
    }

    function isCreator() {
        return groupDetails && admins.some(admin => admin.id === user.id)
    }

    function getSortedMembers() {
        return [...members].sort((a, b) => {
            const aIsAdmin = isAdmin(a.id)
            const bIsAdmin = isAdmin(b.id)
            if (aIsAdmin && !bIsAdmin) return -1
            if (!aIsAdmin && bIsAdmin) return 1
            return 0
        })
    }

    if(group){
        return (
            <div className="message-container">
                <div className="group-header" onClick={() => setShowGroupInfo(!showGroupInfo)}>
                    <h3>Discussions dans le groupe {group.name}</h3>
                    <span className="info-icon">{showGroupInfo ? '✕' : 'ℹ'}</span>
                </div>
                
                {showGroupInfo && (
                    <div className="group-info-panel">
                        <div className="group-info-section">
                            <h4>Informations du groupe</h4>
                            
                            {isCreator() && !isEditingName && (
                                <div className="group-name">
                                    <p>Nom du groupe : <strong>{group.name}</strong></p>
                                    <button onClick={() => { setIsEditingName(true); setNewGroupName(group.name); }} >
                                        Modifier le nom du groupe
                                    </button>
                                </div>
                            )}
                            
                            {isCreator() && isEditingName && (
                                <div>
                                    <div className="edit-group-name">
                                        <strong>Nouveau nom de groupe :</strong>
                                        <input 
                                            type="text" 
                                            value={newGroupName} 
                                            onChange={(e) => setNewGroupName(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && newGroupName.trim()) handleUpdateGroupName() }}
                                            placeholder="Nouveau nom du groupe"
                                        />
                                    </div>
                                    <div id="update-buttons">
                                        <button 
                                            onClick={handleUpdateGroupName} 
                                            disabled={!newGroupName.trim()}
                                            className={newGroupName.trim() ? '' : 'disabled'}>
                                            Valider les modifications
                                        </button>
                                        <button onClick={() => { setIsEditingName(false); setNewGroupName(''); }} 
                                                className="cancel-btn">
                                            Annuler
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {!isCreator() && (
                                <p><strong>Nom :</strong> {group.name}</p>
                            )}
                            
                            <div className="group-creation-info">
                                <p>Créé le <em>{groupDetails && groupDetails.createdAt ? formatDate(groupDetails.createdAt) : 'Date inconnue'}</em></p>
                            </div>
                            {isCreator() && (
                                <button className="delete-group-btn" onClick={handleDeleteGroup}>
                                    Supprimer le groupe
                                </button>
                            )}
                        </div>
                        
                        <div className="group-info-section">
                            <h4>Membres ({members.length})</h4>
                            <ul className="members-list">
                                {getSortedMembers().map(member => (
                                    <li key={member.id}>
                                        <div>
                                            <span className="member-name">
                                                {member.id === user.id ? 'Vous' : member.name}
                                            </span>
                                            {isAdmin(member.id) && <span className="admin-badge">Admin</span>}
                                        </div>
                                        {isCreator() && member.id !== user.id && (
                                            <button className="remove-member-btn" onClick={() => handleRemoveMember(member.id)}>
                                                Retirer
                                            </button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            {isCreator() && (
                                <div className="add-member">
                                    <h4>Ajouter un nouveau membre</h4>
                                    <MemberAdder onUserAdded={() => { updateMembers(); updateAllUsers(); }} groupId={group.id} users={allUsers} />
                                </div>
                            )}
                        </div>
                    </div>
                )}
                
                <div className="messages-section">
                    <MessagesList messages={messages} members={members}/>
                    <MessageAdder onMessageAdded={updateMessages} groupId={group.id}/>
                </div>
            </div>
        )
    }



}

export default GroupMessage
