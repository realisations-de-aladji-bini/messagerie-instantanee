import { useContext } from "react"
import { TokenContext, UserContext } from "../ConnectionContext.js"
import Groups from "./Groups.jsx";
import Button from "../components/Button.jsx";
import '../css/Accueil.css';


function Accueil() {
    const {user, setUser} = useContext(UserContext)
    const {setToken} = useContext(TokenContext)

    function handleLogout() {
        setToken(null)
        setUser(null)
    }

    return (
        <div className="accueil-container">
            <header className="accueil-header">
                <div className="header-content">
                    <div className="welcome-section">
                        <h1>XChangeo</h1>
                        <p className="welcome-text"> <span className="user-name">{user.name}</span></p>
                    </div>
                    <div className="logout-button">
                        <Button clickFonction={handleLogout} title={'Se déconnecter'}/>
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
