import React, { useState, useEffect } from 'react'
import "./home.css"

import ButtonsCustom from '../../components/buttons/custom/ButtonsCustom'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../context/AuthContext'
import { useSocketContext } from '../../context/IOContext'


const Home = () => {
    const [count, setCount] = useState<number>(0)
    const navigate = useNavigate()
    const { games }: any = useSocketContext()
    const { user }: any = useAuthContext()

    //console.log("games", games)
    const handleNewButtonClick = (e: any) => {
        e.stopPropagation()
        navigate('/newGame', { replace: true })
    }
    const handleListButtonClick = (e: any) => {
        e.stopPropagation()
        navigate('/listGame', { replace: true })
    }
    const handleScoreButtonClick = (e: any) => {
        e.stopPropagation()
        navigate('/scoreBoard', { replace: true })
    }

    useEffect(() => {
        setCount(games.length)
    }, [games])

    return (
        <div className='home'>
            <ButtonsCustom nameClass="primary" titleButton="Nouveau jeu" onClick={handleNewButtonClick} />

            <ButtonsCustom nameClass="secondary" titleButton="Liste des jeux" onClick={handleListButtonClick} count={count} />

            <ButtonsCustom nameClass="primary" titleButton="Score" onClick={handleScoreButtonClick} />
        </div>
    )
}

export default Home
