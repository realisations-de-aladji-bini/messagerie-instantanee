import { useContext } from "react";
import { UserContext } from "../ConnectionContext";
import '../css/MessagesList.css'


function MessagesList({messages, members}){
    const {user} = useContext(UserContext)

    return (
    <div className="messagesListBox">
    <ul className="messagesList">
        { messages.minLength !== 0 ? 
        messages.map((message,indice) => {
            const author = members.find(user => user.id == message.userId);
            if(author && author.id === user.id){
                return (
                    <li className="UserIsAuthor" key={indice}>
                        <div className="message">{message.content} <span className="tick">&#10004;</span></div>
                        <div className="author">{author ? author.name: 'unknown'}</div>
                    </li>
                ) 
            }
            return (
                <li key={indice}>
                    <div className="message">{message.content} <span className={'time'}> {message.createdAt.slice(11, 16)}</span></div>

                    <div className="author">{author ? author.name: 'unknown'}</div>
                </li>
            )
        })
        : "Aucun élément" }
    </ul>
    </div>
    )
}

export default MessagesList
