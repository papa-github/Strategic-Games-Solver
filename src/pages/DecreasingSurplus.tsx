import { useState } from "react";
import "../styles/DecreasingSurplus.css"

interface Player {
    name: string;
    batna: number;
    turnOrder: number;
}

interface Pot{
    size: number,
    decreaseType: "constant" | "percentage",
    decreaseAmount: number
}

function InputField(props: {onCalculate: Function}){
    const [player1, setPlayer1] = useState<Player>({name: "Player 1", batna: 0, turnOrder: 1})
    const [player2, setPlayer2] = useState<Player>({name: "Player 2", batna: 0, turnOrder: 2})
    const [pot, setPot] = useState<Pot>({size:100, decreaseType: "constant", decreaseAmount: 1})

    function changePlayer1Name(event: React.ChangeEvent<HTMLInputElement>){
        setPlayer1({...player1, name: event.target.value})
    }

    function changePlayer2Name(event: React.ChangeEvent<HTMLInputElement>){
        setPlayer2({...player2, name: event.target.value})
    }

    function changePlayer1Batna(event: React.ChangeEvent<HTMLInputElement>){
        //Make sure its a number
        if (!(/^\d+(\.\d*)?$/.test(event.target.value))){
            alert("Please enter a number")
            event.target.value = ""
            return
        }
        setPlayer1({...player1, batna: parseFloat(event.target.value)})
    }

    function changePlayer2Batna(event: React.ChangeEvent<HTMLInputElement>){
        //Make sure its a number
        if (!(/^\d+(\.\d*)?$/.test(event.target.value))){
            alert("Please enter a number")
            event.target.value = event.target.value.replace(/\D/g,'');
            return
        }
        setPlayer2({...player2, batna: parseFloat(event.target.value)})
    }

    function changePotSize(event: React.ChangeEvent<HTMLInputElement>){
        //Make sure its a number
        if (!(/^\d+$/.test((event.target.value)))){
            alert("Please enter a number")
            event.target.value = event.target.value.replace(/\D/g,'');
            return
        }
        setPot({...pot, size: parseInt(event.target.value)})
    }

    function setTurnOrder (event: React.ChangeEvent<HTMLSelectElement>){
        const selectedPlayer = event.target.value
        if(selectedPlayer === player1.name){
            setPlayer1({...player1, turnOrder: 1})
            setPlayer2({...player2, turnOrder: 2})
        }else{
            setPlayer1({...player1, turnOrder: 2})
            setPlayer2({...player2, turnOrder: 1})
        }
    }

    function setDecreaseType(event: React.ChangeEvent<HTMLSelectElement>){
        if(event.target.value.includes("Constant")){
            setPot({...pot, decreaseType: "constant"})
        }else{
            setPot({...pot, decreaseType: "percentage"})
        }

    }

    function setDecreaseAmount(event: React.ChangeEvent<HTMLInputElement>){
        //Make sure its a number
        if (!(/^\d+(\.\d*)?$/.test(event.target.value))){
            alert("Please enter a number")
            event.target.value = event.target.value.replace(/\D/g,'');
            return
        }

        setPot({...pot, decreaseAmount: parseFloat(event.target.value)})
    }

    function handleCalculate(){
        // Do some validation
        // If decrease type is constant, it must be greater than 0
        if(pot.decreaseType === "constant" && pot.decreaseAmount <= 0){
            alert("Decrease amount must be greater than 0")
            return
        }
        // If decrease type is percentage, it must be between 0 and 1
        if(pot.decreaseType === "percentage" && (pot.decreaseAmount <= 0 || pot.decreaseAmount >= 1)){
            alert("Decrease amount must be between 0 and 1")
            return
        }
        // Pot size must be an integer
        if(!Number.isInteger(pot.size)){
            alert("Pot size must be an integer")
            return
        }
        // Batna must be less than pot size
        if(player1.batna >= pot.size || player2.batna >= pot.size){
            alert("BATNA must be less than pot size - otherwise the player will always take their BATNA")
            return
        }

        props.onCalculate(player1,player2,pot)

    }

    

    return (
        <div className="input-field">
            Player 1 Name: <input type="text" placeholder={player1.name} onChange={changePlayer1Name}/>
            Player 1 BATNA: <input type="text" placeholder={player1.batna.toString()} onChange={changePlayer1Batna}/>
            <br />
            Player 2 Name: <input type="text" placeholder={player2.name} onChange={changePlayer2Name}/>
            Player 2 BATNA: <input type="text" placeholder={player2.batna.toString()} onChange={changePlayer2Batna}/>
            <br />
            Who goes first? <select onChange={setTurnOrder}><option>{player1.name}</option><option>{player2.name}</option></select>
            <hr />
            Pot Size: <input type="text" placeholder={pot.size.toString()} onChange={changePotSize}/>
            <br />
            How does the pot decrease each round? <select onChange={setDecreaseType}><option>{"Constant - e.g. 1 each round"}</option><option>{"Percentage - e.g. by ×0.9 each round"}</option></select>
            <br />
            How much does the pot decrease each round? <input type="text" placeholder={pot.decreaseType === "constant" ? "e.g. 1"  : "e.g. 0.9"} onChange={setDecreaseAmount}/>
            <br />
            <button onClick={handleCalculate}>Calculate</button>

        </div>
    )
}

function BargainingGrid(props : {player1: Player, player2: Player, pot: Pot}){
    interface NegotiationRound{
        roundNumber: number,
        potSize : number,
        playerTurn: Player,
        player1Offer: number,
        player2Offer: number
    }
    let rows : NegotiationRound[] = []
    let gameEndedEarly = false

    function Negotiate(player1: Player, player2: Player, pot: Pot, roundNumber: number): NegotiationRound{
        //If the current pot is equal to or less than the sum of the BATNAs, then the players will take their BATNAs and the negotiation is over
        if(pot.size <= player1.batna + player2.batna){
            // If there is still some pot left, then the game has ended early
            if (pot.size > 0){
                gameEndedEarly = true
            }
            const lastRow = 
            {
                roundNumber: roundNumber,
                potSize: pot.size,
                playerTurn: player1,
                player1Offer: player1.batna,
                player2Offer: player2.batna
            }
            // Add to rows and return
            rows.push(lastRow)
            return lastRow
        }
        // If the current pot is greater than the sum of the BATNAs, then the players will negotiate
        else{
            // The player whose turn it is will offer what the other player will get next round
            // Player with turn order 1 goes first (moves on odd rounds)
            const offeringPlayer = roundNumber % 2 === 1 ? player1 : player2
            // Get the results of the next round
            const nextPotSize = pot.decreaseType === "constant" ? pot.size - pot.decreaseAmount : pot.size * pot.decreaseAmount
            const nextTurn = Negotiate(player1, player2, {...pot, size: nextPotSize}, roundNumber + 1)
            // Now we can calculate the current round
            const currentRound : NegotiationRound = {
                roundNumber: roundNumber,
                potSize: pot.size,
                playerTurn: offeringPlayer,
                player1Offer: offeringPlayer === player1 ? pot.size - nextTurn.player2Offer : nextTurn.player1Offer,
                player2Offer: offeringPlayer === player2 ? pot.size - nextTurn.player1Offer : nextTurn.player2Offer
            }
            // Add to rows and return
            rows.push(currentRound)
            return currentRound
        }
    }

    // Output the results of the negotiation in a table ordered by round number, descending
    Negotiate(props.player1, props.player2, props.pot, 1)

    return (

        <div className="bargaining-container">
            {/* If the negotiation is over, but there the pot still has content, inform the user.*/
            gameEndedEarly && <div className="game-ended-early">The negotiation ended early as each player has decided to take their BATNA. From the last round onwards, each player simply takes their BATNA</div>}
            
            <div className="bargaining-results">
                <div className="bargaining-grid">
                    <table>
                        <thead>
                            <tr>
                                <th>Round</th>
                                <th>Pot Size</th>
                                <th>Player Turn</th>
                                <th>{props.player1.name}</th>
                                <th>{props.player2.name}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.sort((a,b) => b.roundNumber - a.roundNumber).map(row =>
                                <tr key={row.roundNumber}>
                                    <td>{row.roundNumber}</td>
                                    <td>{row.potSize}</td>
                                    <td>{row.playerTurn.name}</td>
                                    <td>{row.player1Offer}</td>
                                    <td>{row.player2Offer}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="information-section">
                    {props.player1.name} BATNA: {props.player1.batna}
                    <br />
                    {props.player2.name} BATNA: {props.player2.batna}
                    <br />
                    Sum of BATNAs: {props.player1.batna + props.player2.batna}
                    <br />
                    Surplus: {props.pot.size - (props.player1.batna + props.player2.batna)}
                </div>
            </div>
        </div>

    )
    

}

export default function DecreasingSurplus() {
    const [player1, setPlayer1] = useState<Player>({name: "Player 1", batna: 0, turnOrder: 1})
    const [player2, setPlayer2] = useState<Player>({name: "Player 2", batna: 0, turnOrder: 2})
    const [pot, SetPot] = useState<Pot>({size:100, decreaseType: "constant", decreaseAmount: 1})
    const [showCalculation, setShowCalculation] = useState<boolean>(false)
    
    function onCaluclate(player1:Player, player2:Player, pot:Pot){
        setPlayer1(player1)
        setPlayer2(player2)
        SetPot(pot)
        setShowCalculation(true)
    }
    return (
        <div className="decreasing-surplus">
            <h1>Decreasing Surplus Calculator</h1>
            <InputField onCalculate={onCaluclate}/>
            {showCalculation && <BargainingGrid player1={player1} player2={player2} pot={pot}/>}
        </div>
    )
}

