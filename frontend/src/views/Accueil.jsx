import { useContext } from "react"
import { TokenContext, UserContext } from "../ConnectionContext.js"
import Groups from "./Groups.jsx";
import Button from "../components/Button.jsx";
import '../css/Accueil.css';


function Accueil() {
    const {user} = useContext(UserContext)
    const {setToken} = useContext(TokenContext)


    return (
        <div className="accueil-container">
            <header className="accueil-header">
                <div className="header-content">
                    <div className="welcome-section">
                        <h1>XChangeo</h1>
                        <p className="welcome-text">Bienvenue, <span className="user-name">{user.name}</span></p>
                    </div>
                    <div className="logout-button">
                        <Button clickFonction={()=>setToken(null)} title={'Se deconnecter'}/>
                    </div>
                </div>
            </header>
            <main className="accueil-main">
                <Groups />
            </main>
        </div>
    )
}

export default Accueil
