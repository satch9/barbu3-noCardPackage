import React, { useEffect } from 'react'
import ButtonCustomMenu from '../../components/buttons/menu/ButtonMenu'

import { socket } from '../../context/IOContext'
import { useSocketContext } from '../../context/IOContext'
import { useAuthContext } from '../../context/AuthContext'

const Game = () => {

    const { games }: any = useSocketContext()
    const { user }: any = useAuthContext()
    //console.log("games", games)
    //console.log("user", user)

    useEffect(()=>{
        socket.on('gameStarted', (data: any) => {
            console.log("gameStarted", data)
        })

    },[]) 
    
    return (
        <div>
            <ButtonCustomMenu />
            game
        </div>
    )
}

export default Game
