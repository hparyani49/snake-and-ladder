import React from 'react';
import DiceGif from '../../../assets/dice.gif';
import './game.scss';
import { useState } from 'react';

const Game = (props) => {

    const GAMEROW = 10, GAMECOL = 10;
    //Utills
    const getPlaceholder = (row, col) => {
        return row * 10 + (row % 2 === 0 ? col + 1 : GAMECOL - col);
    }
    const getPos = (num) => {
        if (!num) {
            return '00';
        }
        let row = Math.floor(num / 10);
        let col = (row % 2 === 0 ? num % 10 : GAMECOL - num % 10 - 1);
        return row + '' + col;
    }
    const getDiceValue = (max = 7) => {
        let value = Math.floor(Math.random() * Math.floor(max));
        if (!value) {
            return getDiceValue();
        } else {
            return value;
        }
    }

    let initialGame = [];
    let ladders = { '16': 33, '22': 56, '59': 88, '51': 80 };
    let snakes = { '39': 27, '40': 19, '64': 47, '94': 72 };
    for (let i = GAMEROW - 1; i >= 0; i--) {
        initialGame[i] = [];
        for (let j = 0; j < GAMECOL; j++) {
            initialGame[i][j] = getPlaceholder(i, j);
        }
    }
    let playerInitPos = {};
    let initPlayers = [{ name: 'Player 1', pos: '' }, { name: 'Player 2', pos: '' }];
    const [playerPos, setPlayerPos] = useState(playerInitPos);
    const [players, setPlayers] = useState(initPlayers);
    const [activePlayer, setActivePlayer] = useState(0);

    //Dice states
    const [isRolling, setIsRolling] = useState(false);
    const [diceVal, setDiceVal] = useState(0);

    //Init games
    const [startGame, setStartGame] = useState(false);

    const onDiceClick = () => {
        setIsRolling(true);
        setTimeout(() => {
            let isTogglePlayer = true;
            setIsRolling(false);
            let diceVal = getDiceValue();
            setDiceVal(diceVal);
            let newPlayerPos = { ...playerPos };
            let newPlayers = [...players];

            let activePlayerObj = newPlayers[activePlayer];
            let oldPos = activePlayerObj.pos;
            let newPos = getPos((activePlayerObj.pos ? Number(getPos(activePlayerObj.pos)) : -1) + diceVal);
            // let newPos = getPos(Number(getPos(activePlayerObj.pos ? Number(activePlayerObj.pos) : 0)) + diceVal);

            if (Number(newPos) >= 100) {
                togglePlayer();
                return;
            } else if (Number(newPos) == 90) {
                alert('Winner is ' + activePlayerObj.name);
                window.location.reload();
            }

            if (newPlayerPos[newPos]) {
                let elimPlayerName = newPlayerPos[newPos][0];
                newPlayers[getPlayerIndex(elimPlayerName)].pos = '';
                isTogglePlayer = false;
            }

            if (ladders[newPos]) {
                newPos = getPos(ladders[newPos]);
            } else if (snakes[newPos]) {
                newPos = getPos(snakes[newPos]);
            }

            newPlayerPos[newPos] = [activePlayerObj.name];

            if (oldPos) {
                delete newPlayerPos[oldPos];
            }

            if (diceVal == 6) {
                isTogglePlayer = false;
            }

            activePlayerObj.pos = newPos;
            isTogglePlayer && togglePlayer();
            setPlayerPos(newPlayerPos);
            setPlayers(newPlayers);
        }, 300)
    }

    const togglePlayer = () => {
        let numberOfPlayers = players.length;
        if(numberOfPlayers == 1){
            return;
        }
        if (activePlayer == numberOfPlayers - 1) {
            setActivePlayer(0);
        } else {
            setActivePlayer(++activePlayer);
        }
    }

    const getPlayerIndex = (name) => {
        for (let i = 0; i < players.length; i++) {
            if (players[i].name == name) {
                return i;
            }
        }
    }

    const selectPlayerAndStart = (e) => {
        let numOfPlayers = e.target.value;
        let newPlayers = [];
        for(let i = 1; i <= numOfPlayers; i++){
            let playerInfo = {name: 'Player ' + i, pos: ''}
            newPlayers.push(playerInfo);
        }
        setPlayers(newPlayers);
        setStartGame(true);
    }


    return (
        <>
            <div className='game-container'>
                <h2 className='heading'>Snakes & Ladders</h2>
                <h4 className='heading'>Active Player: <span className={`player player-${activePlayer}`}>{players[activePlayer].name}</span></h4>
                <div className='start-positions'>
                    <h2 className='player-heading'>Players:</h2>
                    {players.map((cur, index) => {
                        return <div className='each-player'><div className='name'>{cur.name}</div><div className={`player-circle player-${index}`}></div></div>
                    })}
                </div>
                <div className='board'>
                    {initialGame.map((row, rowIndex) => {
                        return <div className='row'>
                            {row.map((col, colIndex) => {
                                return <div className={`col ${initialGame[rowIndex][colIndex] % 2 == 0 ? 'even' : 'odd'}`}>
                                    <div className='board-place'>{initialGame[rowIndex][colIndex]}</div>
                                    {Object.keys(playerPos).map((cur) => {
                                        if (cur == (rowIndex + '' + colIndex)) {
                                            return <>
                                                {playerPos[cur].map((eachPlayer, playerIndex) => {
                                                    return <div className={`player player-${getPlayerIndex(eachPlayer)}`}></div>
                                                })}
                                            </>
                                        }
                                    })}
                                </div>
                            })}
                        </div>
                    })}
                </div>
                <div className='dice-holder'>
                    <div className='dice' onClick={onDiceClick}>
                        {isRolling ? <img src={DiceGif} className='dice-gif' /> :
                            <div className='dice-value'>{diceVal}</div>}
                    </div>
                </div>
            </div>
            {!startGame ? <>
                <div className='select-players'>
                    <p>How Many Players?</p>
                    <div>
                        <input type="radio" id="1" name="players" value="1" onClick={selectPlayerAndStart} />
                        <label for="male">1</label><br />
                    </div>
                    <div>
                        <input type="radio" id="2" name="players" value="2" onClick={selectPlayerAndStart} />
                        <label for="female">2</label><br />
                    </div>
                    <div>
                        <input type="radio" id="3" name="players" value="3" onClick={selectPlayerAndStart} />
                        <label for="other">3</label><br />
                    </div>
                    <div>
                        <input type="radio" id="4" name="players" value="4" onClick={selectPlayerAndStart} />
                        <label for="other">4</label>
                    </div>
                </div>
                <div className='overlay'></div>
            </> : null}
        </>
    )
}

export default Game;