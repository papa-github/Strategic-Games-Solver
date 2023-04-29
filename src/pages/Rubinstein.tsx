import { useState } from "react";
import "../styles/Rubinstein.css"
import { InlineMath } from "react-katex";


interface Player {
    name: string;
    discountFactor: number;
    batna: number;
    turnOrder: number;
}

interface Pot {
    size: number;
}

function InputField(props: {onCalculate: Function}){
    const [player1, setPlayer1] = useState<Player>({name: "Dealer", discountFactor: 0.9, batna: 0, turnOrder: 1})
    const [player2, setPlayer2] = useState<Player>({name: "Marion", discountFactor: 0.5, batna: 0, turnOrder: 2})
    const [pot, setPot] = useState<Pot>({size: 1000})


    function changePlayer1Name(event: React.ChangeEvent<HTMLInputElement>){
        setPlayer1({...player1, name: event.target.value})
    }

    function changePlayer2Name(event: React.ChangeEvent<HTMLInputElement>){
        setPlayer2({...player2, name: event.target.value})
    }

    function checkIfFloat(event: React.ChangeEvent<HTMLInputElement>): boolean{
        //Make sure its a number
        if (!(/^\d+(\.\d*)?$/.test(event.target.value))){
            alert("Please enter a number")
            event.target.value = event.target.value.replace(/[^0-9.]/g,'').replace(/(\..*)\./g, '$1');
            return false
        }
        return true
    }

    function changePlayer1Batna(event: React.ChangeEvent<HTMLInputElement>){
        if (!checkIfFloat(event)){return}
        setPlayer1({...player1, batna: parseFloat(event.target.value)})
    }

    function changePlayer2Batna(event: React.ChangeEvent<HTMLInputElement>){
        if (!checkIfFloat(event)){return}
        setPlayer2({...player2, batna: parseFloat(event.target.value)})
    }

    function changePlayer1DiscountFactor(event: React.ChangeEvent<HTMLInputElement>){
        if (!checkIfFloat(event)){return}
        setPlayer1({...player1, discountFactor: parseFloat(event.target.value)})
    }

    function changePlayer2DiscountFactor(event: React.ChangeEvent<HTMLInputElement>){
        if (!checkIfFloat(event)){return}
        setPlayer2({...player2, discountFactor: parseFloat(event.target.value)})
    }

    function changePotSize(event: React.ChangeEvent<HTMLInputElement>){
        if (!checkIfFloat(event)){return}
        setPot({...pot, size: parseFloat(event.target.value)})
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



    function handleCalculate(){
        props.onCalculate(player1,player2,pot)
    }
    

    return (
        <div className="input-field">
            Player 1 Name: <input type="text" placeholder={player1.name} onChange={changePlayer1Name}/>
            Player 1 Discount Factor: <input type="text" placeholder={player1.discountFactor.toString()} onChange={changePlayer1DiscountFactor}/>
            Player 1 BATNA: <input type="text" placeholder={"Optional: " + player1.batna.toString()} onChange={changePlayer1Batna}/>
            <br />
            Player 2 Name: <input type="text" placeholder={player2.name} onChange={changePlayer2Name}/>
            Player 2 Discount Factor: <input type="text" placeholder={player2.discountFactor.toString()} onChange={changePlayer2DiscountFactor}/>
            Player 2 BATNA: <input type="text" placeholder={"Optional: " + player2.batna.toString()} onChange={changePlayer2Batna}/>
            <br />
            Who goes first? <select onChange={setTurnOrder}><option>{player1.name}</option><option>{player2.name}</option></select>
            <hr />
            Pot Size: <input type="text" placeholder={pot.size.toString()} onChange={changePotSize}/>
            <br />
            <div style={{textAlign: 'center'}}><button onClick={handleCalculate} className="calculate-button" >Calculate</button></div>


        </div>
    )
}

function RubinsteinGrid(props: {player1: Player, player2: Player, pot: Pot}){

    
    interface NegotiationRound{
        playerTurn : Player,
        player1Offer: number,
        player2Offer: number
    }
    let surplus = props.pot.size - (props.player1.batna + props.player2.batna)
    let negotiationRounds: NegotiationRound[] = []

    let y = (1 - props.player1.discountFactor) / (1 - (props.player1.discountFactor * props.player2.discountFactor))
    let x = (1 - props.player2.discountFactor) / (1 - (props.player1.discountFactor * props.player2.discountFactor))
    console.log("x: " + x + " y: " + y)
    
    // Player with turn order 1 goes first
    if(props.player1.turnOrder === 1){
        let player1Offer = x * surplus
        let player2Offer = y * props.player2.discountFactor * surplus
        negotiationRounds.push({playerTurn: props.player1, player1Offer: player1Offer, player2Offer: player2Offer})
        // Now player 2 offers
        player1Offer = x * props.player1.discountFactor * surplus
        player2Offer = y * surplus
        negotiationRounds.push({playerTurn: props.player2, player1Offer: player1Offer, player2Offer: player2Offer})
    }else{
        let player1Offer = x * props.player1.discountFactor * surplus
        let player2Offer = y * surplus
        negotiationRounds.push({playerTurn: props.player2, player1Offer: player1Offer, player2Offer: player2Offer})
        // Now player 1 offers
        player1Offer = x * surplus
        player2Offer = y * props.player2.discountFactor * surplus
        negotiationRounds.push({playerTurn: props.player1, player1Offer: player1Offer, player2Offer: player2Offer})
    }

    let calcRow1 =  <tr>
                        <td>{props.player1.turnOrder}</td>
                        <td>{props.player1.name}</td>
                        <td><InlineMath>{`Surplus × 1-${props.player2.discountFactor}y\\quad(=x)`}</InlineMath></td>
                        <td><InlineMath>{`Surplus × ${props.player2.discountFactor}y`}</InlineMath></td>
                    </tr>
    let calcRow2 =  <tr>
                        <td>{props.player2.turnOrder}</td>
                        <td>{props.player2.name}</td>
                        <td><InlineMath>{`Surplus × ${props.player1.discountFactor}x`}</InlineMath></td>
                        <td><InlineMath>{`Surplus × 1-${props.player1.discountFactor}x\\quad(=y)`}</InlineMath></td>
                    </tr>  

    // Output a table of the negotiation rounds
    return (
        <div className="rubinstein-calculations">
            <h2>Calculations</h2>
            <InlineMath>{"Surplus = " + props.pot.size + " - (" + props.player1.batna + " + " + props.player2.batna + ") =" + surplus.toFixed(2).toString()}</InlineMath> <br/>
            <br/>
            <InlineMath>{`x = (1 - δ_{${props.player2.name}}) / (1 - δ_{${props.player1.name}}δ_{${props.player2.name}}) = \\frac{1 - ${props.player2.discountFactor}}{1 - ${props.player1.discountFactor}×${props.player2.discountFactor}} = `+ x.toFixed(5)}</InlineMath> <br />
            <br/>
            <InlineMath>{`y = (1 - δ_{${props.player1.name}}) / (1 - δ_{${props.player1.name}}δ_{${props.player2.name}}) = \\frac{1 - ${props.player1.discountFactor}}{1 - ${props.player1.discountFactor}×${props.player2.discountFactor}} = `+ y.toFixed(5)}</InlineMath> <br />
            <br/>
            <u>{props.player1.name}'s turn:</u> <br/>
            {props.player1.name} Percentage of surplus: <InlineMath>{x.toFixed(2)}</InlineMath> <br/>
            {props.player2.name} Percentage of surplus: <InlineMath>{"1 - " + y.toFixed(2) + ` = ${(1 - x).toFixed(2)}`}</InlineMath> <br/>
            <br></br>
            <u>{props.player2.name}'s turn:</u> <br/>
            {props.player2.name} Percentage of surplus: <InlineMath>{y.toFixed(2)}</InlineMath> <br/>
            {props.player1.name} Percentage of surplus: <InlineMath>{"1 - " + x.toFixed(2) + ` = ${(1 - y).toFixed(2)}`}</InlineMath> <br/>
            <br/>

            <table>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Player making offer</th>
                        <th>{props.player1.name}</th>
                        <th>{props.player2.name}</th>
                    </tr>
                </thead>
                <tbody>
                        {props.player1.turnOrder === 1 ? calcRow1 : calcRow2}
                        {props.player1.turnOrder === 1 ? calcRow2 : calcRow1}
                </tbody>
            </table>
            
            
            
            <h2> Result </h2>
            <table>
                <thead>
                    <tr>
                        <th>Round</th>
                        <th>Player making offer</th>
                        <th>{props.player1.name}</th>
                        <th>{props.player2.name}</th>
                    </tr>
                </thead>
                <tbody>
                    {negotiationRounds.map((round, index) => {
                        return (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{round.playerTurn.name}</td>
                                <td>{round.player1Offer.toFixed(2)}</td>
                                <td>{round.player2Offer.toFixed(2)}</td>
                            </tr>
                        )
                    }
                    )}
                </tbody>
            </table>
        </div>
    )

}


export default function Rubinstein() {
    const [player1, setPlayer1] = useState<Player>({name: "Dealer", discountFactor: 0.9, batna: 0, turnOrder: 1})
    const [player2, setPlayer2] = useState<Player>({name: "Marion", discountFactor: 0.5, batna: 0, turnOrder: 2})
    const [pot, setPot] = useState<Pot>({size: 1000})
    const [showCalculation, setShowCalculation] = useState<boolean>(false)

    function calculate(player1: Player, player2: Player, pot: Pot){
        setPlayer1(player1)
        setPlayer2(player2)
        setPot(pot)
        setShowCalculation(true)
    }

    return (
        <div className="rubinstein-bargaining">
            <h1>Rubinstein Bargaining Calculator</h1>
            <InputField onCalculate={calculate}/>
            {showCalculation && <RubinsteinGrid player1={player1} player2={player2} pot={pot}/>}
        </div>
    )
}