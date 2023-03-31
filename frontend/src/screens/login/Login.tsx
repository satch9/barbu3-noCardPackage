import { useState } from 'react'
import "./Login.css"
import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from '../../context/AuthContext'


const Login = () => {
    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const navigate = useNavigate()
    const { login }: any = useAuthContext()


    const handleSubmit = async () => {


        if (username != '' || password != '' && login(username, password)) {
            console.log("username", username)
            console.log("password", password)
            // navigate to the home page
            navigate('/home', { replace: true })
        }

    }

    const handleRegisterPage = () => {
        console.log("register")
        navigate("/register", { replace: true })
    }

    return (
        <div className="login-card">
            <div className="column">
                <h1>Connexion</h1>
                <p>Après votre connexion, place au jeu !</p>
                <form className="login-form">
                    <div className="form-item">
                        <input
                            type="text"
                            className="form-element"
                            name="username"
                            required={true}
                            placeholder="Nom d'utilisateur ou email"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-item">
                        <input
                            type="password"
                            className="form-element"
                            name="password"
                            required={true}
                            placeholder="Mot de passe"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="form-checkbox-item">
                        <input type="checkbox" className="form-checkbox-element" id="rememberMe" defaultChecked />
                        <label htmlFor="rememberMe">Se souvenir de moi</label>
                    </div>
                    <div className="flex">
                        <button type="button" onClick={handleSubmit}>Se connecter</button>
                        <a href="#">Effacer votre mot de passe</a>
                        {/* <button type="button" onClick={handleRegisterPage}>S'enregistrer </button> */}
                    </div>
                </form>
            </div>
            <div className="column">
                <h2>Barbu</h2>
                <p>Si vous navez pas encore de compte, enregistrez-vous!</p>
                <Link to="/register">S'enregistrer</Link>
            </div>
        </div>
    )
}

export default Login
