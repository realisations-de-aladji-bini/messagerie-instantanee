import { useContext } from "react";
import { UserContext } from "../ConnectionContext";
import '../css/MessagesList.css'


function MessagesList({messages, members}){
    const {user} = useContext(UserContext)

    function parseMarkdown(text) {
        let parsed = text
        // Gras: **texte**
        parsed = parsed.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
        // Italique: *texte*
        parsed = parsed.replace(/\*(.+?)\*/g, '<em>$1</em>')
        // Barré: ~texte~
        parsed = parsed.replace(/~(.+?)~/g, '<s>$1</s>')
        // Code: `texte`
        parsed = parsed.replace(/`(.+?)`/g, '<code>$1</code>')
        return parsed
    }

    function formatTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        // Comparer les dates sans l'heure
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());

        if (dateOnly.getTime() === todayOnly.getTime()) {
            return "Aujourd'hui";
        } else if (dateOnly.getTime() === yesterdayOnly.getTime()) {
            return "Hier";
        } else {
            return date.toLocaleDateString('fr-FR', { 
                weekday: 'short', 
                day: '2-digit', 
                month: 'short', 
                year: 'numeric' 
            });
        }
    }

    function getDateOnly(dateString) {
        const date = new Date(dateString);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
    }

    function formatNotification(content, authorId) {
        const addMatch = content.match(/^(.+?) a ajouté (.+)$/)
        if (addMatch) {
            const authorName = addMatch[1]
            const addedName = addMatch[2]
            
            if (authorId === user.id) {
                return `Vous avez ajouté ${addedName}`
            }
            
            if (addedName === user.name) {
                return `${authorName} vous a ajouté`
            }
        }

        const createMatch = content.match(/^(.+?) a créé le groupe$/)
        if (createMatch) {
            const creatorName = createMatch[1]
            
            if (authorId === user.id) {
                return `Vous avez créé le groupe`
            }
            
            return `${creatorName} a créé le groupe`
        }
        
        return content
    }

    return (
    <div className="messagesListBox">
    <ul className="messagesList">
        { messages.minLength !== 0 ? 
        messages.map((message,indice) => {
            const author = members.find(user => user.id == message.userId);
            const showDateSeparator = indice === 0 || 
                getDateOnly(messages[indice - 1].createdAt) !== getDateOnly(message.createdAt);
            
            return (
                <div key={indice}>
                    {showDateSeparator && (
                        <div className="date-separator">
                            <span>{formatDate(message.createdAt)}</span>
                        </div>
                    )}
                    {message.type === 'notification' ? (
                        <div className="notification-message">
                            <span>{formatNotification(message.content, message.userId)}</span>
                        </div>
                    ) : author && author.id === user.id ? (
                        <li className="UserIsAuthor">
                            <div className="message">
                                <div className="message-content" dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}></div>
                                <span className="time">{formatTime(message.createdAt)} <span className="tick">&#10004;</span></span>
                            </div>
                        </li>
                    ) : (
                        <li>
                            <div className="message">
                                <div className="author">{author ? author.name: 'unknown'}</div>
                                <div className="message-content" dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}></div>
                                <span className="time">{formatTime(message.createdAt)}</span>
                            </div>
                        </li>
                    )}
                </div>
            )
        })
        : "Aucun élément" }
    </ul>
    </div>
    )
}

export default MessagesList
