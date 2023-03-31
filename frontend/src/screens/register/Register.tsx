import { useState } from 'react'
import "./register.css"

import { Link, useNavigate } from "react-router-dom"
import { useAuthContext } from '../../context/AuthContext'


const Register = () => {

    const [username, setUsername] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')


    const { register }: any = useAuthContext()

    const navigate = useNavigate()

    const handleRegister = async () => {
        console.log("username", username)
        console.log("password", password)
        console.log("email", email)

        if (register(username, password, email)) {
            // navigate to the home page
            navigate('/home', { replace: true })
        }

    }

    const handleLoginPage = () => {
        console.log("login")
        navigate("/", { replace: true })
    }

    return (
        <div className="register-card">
            <div className="column">
                <h1>Enregistrez-vous !!!</h1>
                <form className="register-form">
                    <div className="form-item">
                        <input
                            type="text"
                            className="form-element"
                            name="username"
                            required={true}
                            placeholder="Nom d'utilisateur"
                            autoComplete="off"
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="form-item">
                        <input
                            type="text"
                            className="form-element"
                            name="email"
                            required={true}
                            placeholder="Email"
                            autoComplete="off"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="form-item">
                        <input
                            type="password"
                            className="form-element"
                            name="password"
                            required={true}
                            placeholder="Mot de passe"
                            autoComplete="off"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex">
                        <button type="button" onClick={handleRegister}>S'enregistrer </button>
                        <button type="button" onClick={handleLoginPage}>Se connecter</button>
                    </div>
                </form>
            </div>
            <div className="column">
                <h2>Barbu</h2>
                <p>Si vous avez déjà de compte, connectez-vous!</p>
                <Link to="/">Se Connecter</Link>
            </div>

        </div>
    )
}

export default Register
