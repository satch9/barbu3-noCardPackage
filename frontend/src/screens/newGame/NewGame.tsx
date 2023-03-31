import React, { useEffect, useState } from 'react'
import "./newGame.css"

import ButtonsCustom from '../../components/buttons/custom/ButtonsCustom';

import { socket } from '../../context/IOContext';
import { useAuthContext } from '../../context/AuthContext'
import { useNavigate } from 'react-router-dom';
import ButtonMenu from '../../components/buttons/menu/ButtonMenu';


const NewGame = () => {
    const [players, setPlayers] = React.useState<number>(2)
    const [partyName, setPartyName] = useState('');


    const { cookies }: any = useAuthContext()
    const navigate = useNavigate()

    console.log("cookies", cookies.barbu.username)



    useEffect(() => {
        const generateFakeNameParty = () => {
            fetch('https://random-word-api.herokuapp.com/word?number=1&length=15')
                .then(response => response.json())
                .then(data => {
                    //console.log('Success:', data)
                    let date = new Date().toLocaleDateString('fr-fr', { year: 'numeric', month: 'numeric', day: 'numeric' }).replace(/\//g, '')
                    //console.log("date", date)
                    setPartyName(data[0] + date);
                })
                .catch(error => {
                    console.error(error);
                });
        }
        generateFakeNameParty()
    }, [players])

    const handleGenerateBoard = (e: any) => {
        e.preventDefault()
        socket.emit('generateBoard', {
            maxPlayers: players,
            user: {
                userId: cookies.barbu.id,
                username: cookies.barbu.username,
            },
            gameName: partyName
        })
        socket.on('generatedBoard', (data: any) => {
            console.log("generatedBoard", data)
            const gameID = data.gameID
            // navigate to the list game page
            navigate(`/game/${gameID}`, { replace: true })
        })
    }

    return (
        <div className="newGame">
            <ButtonMenu />
            <form className="newGame-form">
                <h1 className="newGame-title">Nouvelle partie</h1>

                {/* paramètres du jeu */}
                <div className="gameParameters">
                    <div className="gameParameters__item">
                        <input
                            type="number"
                            name="maxPlayers"
                            id="maxPlayers" className="form-element"
                            placeholder='Nombre de joueurs'
                            onChange={(e: any) => setPlayers(parseInt(e.target.value))}
                            max={4}
                            min={2}
                            defaultValue={2}
                        />
                    </div>
                </div>

                <ButtonsCustom nameClass="secondary" titleButton="Générer le jeu" onClick={handleGenerateBoard} />
            </form>

        </div>
    )
}

export default NewGame
