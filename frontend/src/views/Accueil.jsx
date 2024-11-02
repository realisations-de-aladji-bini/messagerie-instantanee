import { useContext } from "react"
import { TokenContext, UserContext } from "../ConnectionContext.js"
import Groups from "./Groups.jsx";
import Button from "../components/Button.jsx";


function Accueil() {
    const {user} = useContext(UserContext)
    const {setToken} = useContext(TokenContext)


    return (
        <div>
        <div className="identityBox">
            Welcome
            <div className='userName'> {user.name}
                <Button clickFonction={()=>setToken(null)} title={'Se deconnecter'}/>
            </div>

        </div>
        <Groups />
        </div>

    )
}

export default Accueil
