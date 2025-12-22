import { useContext, useRef, useState, useEffect } from "react"
import Button from "./Button"
import { TokenContext } from "../ConnectionContext"
import { host} from "../utilities/apis"

function MessageAdder({onMessageAdded, groupId}){
    const { token } = useContext(TokenContext)
    const messageRef = useRef(null)
    const [content, setContent] = useState('')
    const [showToolbar, setShowToolbar] = useState(false)
    const [toolbarPosition, setToolbarPosition] = useState({ top: 0, left: 0 })
    const [selection, setSelection] = useState({ start: 0, end: 0 })

    async function addMessage(content){
        const response = await (await fetch(host + "api/messages/"+groupId, 
          {
            method:'POST',
            headers:{'Content-type':'application/json', 'x-access-token':token},
            body: JSON.stringify({content})
          })).json()
          if (response.status) {
            onMessageAdded()
          }
    }

    function handleAdd(){
        if(messageRef.current && messageRef.current.value!=='' ){
            addMessage(messageRef.current.value)
        }
        messageRef.current.value=''
        setContent('')
    }

    function handleKeyDown(e){
        if(e.key === 'Enter'){
            handleAdd()
        }
    }

    function handleSelect(e){
        const start = e.target.selectionStart
        const end = e.target.selectionEnd
        
        if(start !== end && content.length > 0) {
            setSelection({ start, end })
            const rect = e.target.getBoundingClientRect()
            setToolbarPosition({
                top: rect.top - 45,
                left: rect.left + (start + end) / 2 * 8
            })
            setShowToolbar(true)
        } else {
            setShowToolbar(false)
        }
    }

    function applyFormat(format) {
        const { start, end } = selection
        const selectedText = content.substring(start, end)
        let formattedText = ''
        
        switch(format) {
            case 'bold':
                formattedText = `**${selectedText}**`
                break
            case 'italic':
                formattedText = `*${selectedText}*`
                break
            case 'strikethrough':
                formattedText = `~${selectedText}~`
                break
            case 'code':
                formattedText = `\`${selectedText}\``
                break
            default:
                formattedText = selectedText
        }
        
        const newContent = content.substring(0, start) + formattedText + content.substring(end)
        setContent(newContent)
        messageRef.current.value = newContent
        setShowToolbar(false)
        
        // Remettre le focus sur l'input
        setTimeout(() => {
            messageRef.current.focus()
            messageRef.current.setSelectionRange(start + formattedText.length, start + formattedText.length)
        }, 0)
    }

    useEffect(() => {
        function handleClickOutside() {
            setShowToolbar(false)
        }
        
        if(showToolbar) {
            document.addEventListener('click', handleClickOutside)
        }
        
        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [showToolbar])


    return (
        <div className="messageAdder">
            {showToolbar && (
                <div 
                    className="format-toolbar" 
                    style={{ top: `${toolbarPosition.top}px`, left: `${toolbarPosition.left}px` }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button onClick={() => applyFormat('bold')} title="Gras">
                        <strong>B</strong>
                    </button>
                    <button onClick={() => applyFormat('italic')} title="Italique">
                        <em>I</em>
                    </button>
                    <button onClick={() => applyFormat('strikethrough')} title="Barré">
                        <s>S</s>
                    </button>
                    <button onClick={() => applyFormat('code')} title="Code">
                        <code>&lt;/&gt;</code>
                    </button>
                </div>
            )}
            <input 
                ref={messageRef} 
                type="text" 
                placeholder='Saisissez votre nouveau message ici ... puis appuyez sur Entrée ou cliquez sur Envoyer le message' 
                onKeyDown={handleKeyDown}
                onChange={(e) => setContent(e.target.value)}
                onSelect={handleSelect}
                onMouseUp={handleSelect}
                value={content}
            />
            <Button title={"Envoyer le message"} clickFonction={handleAdd} disabled={content.trim() === ''} />
        </div>
    )

}

export default MessageAdder
