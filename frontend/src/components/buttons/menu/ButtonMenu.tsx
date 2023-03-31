import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./buttonMenu.css"

const ButtonMenu = () => {
    const navigate = useNavigate()

    const onClick = () => {
        console.log("onClick")
        navigate("/home", { replace: true })
    }
    return (
        <button className="button__menu" onClick={onClick}>
            Menu
        </button>
    )
}

export default ButtonMenu
