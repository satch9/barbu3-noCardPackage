import React, { useEffect } from 'react'
import "./listGame.css"

import ButtonsCustom from '../../components/buttons/custom/ButtonsCustom'
import ButtonCustomMenu from '../../components/buttons/menu/ButtonMenu'


import { socket } from '../../context/IOContext'
import { useSocketContext } from '../../context/IOContext'
import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';


const ListGame = () => {

    const { games }: any = useSocketContext()
    const { user }: any = useAuthContext()
    const navigate = useNavigate()

    //console.log("games", games)
    //console.log("user", user)

    const gameJoin = (game_id: any) => {
        console.log("joinGame")
        socket.emit('joinGame', {
            gameID: game_id,
            user: {
                userId: user.id,
                username: user.username,
            }
        })

    }

    useEffect(() => {
        socket.on('joinedGame', (data: any) => {
            console.log("joinedGame", data)
            const gameID = data.gameID
            // navigate to the list game page
            navigate(`/game/${gameID}`, { replace: true })
        })
    }, [])

    return (

        <div className="listGame">
            <ButtonCustomMenu />
            {
                games && games.map((game: any, index: number) => {
                    return (
                        <div className="listGame__card" key={index}>

                            <div className="listGame__name">
                                Nom : {game.gameName}
                            </div>
                            <div className="listGame__players">
                                Joueurs : {game.players} / {game.maxPlayers}
                            </div>


                            <div className="listGame__join">
                                {game.players.length >= game.maxPlayers ?
                                    "" :
                                    <ButtonsCustom
                                        nameClass="secondary"
                                        titleButton="Rejoindre"
                                        onClick={() => { gameJoin(game.id) }}
                                    />

                                }

                            </div>

                        </div>
                    )
                })
            }

        </div>

    )
}

export default ListGame
