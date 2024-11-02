import { useEffect, useState, useContext } from "react"
import Container from "../components/Container"
import { TokenContext, UserContext } from "../ConnectionContext"
import MessageAdder from "../components/MessageAdder"
import MessagesList from "../components/MessagesList"
import { host } from "../utilities/apis"


function GroupMessage({group}) {
    const [messages, setMessages] = useState([])
    const [members, setMembers] = useState([])
    const { token } = useContext(TokenContext)

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
        }
        return () => clearInterval(interval)
    },[group])

    const updateMessages = () => {
        fetch(host + "api/messages/"+group.id, {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setMessages(resp.groupMessages))
        .catch(error => {
            console.error("Error fetching messages")
        })
    }

    const updateMembers = () => {
        fetch(host + "api/mygroups/"+group.id, {headers:{"x-access-token": token}})
        .then(resp => resp.json())
        .then(resp => setMembers(resp.data))
        .catch(error => {
            console.error("Error fetching groups member")
        })
    }

    if(group){
        return (
            <Container title={`Discussion sur le group ${group.name}`} className="messageBox">
                
                <MessagesList messages={messages} members={members}/>
            
                <MessageAdder onMessageAdded={updateMessages} groupId={group.id}/>
                
            </Container>
        )
    }



}

export default GroupMessage
