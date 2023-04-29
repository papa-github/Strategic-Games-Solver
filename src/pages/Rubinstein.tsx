import { useState } from "react";

interface Player {
    name: string;
    discountFactor: number;
    batna: number;
    turnOrder: number;
}

function InputField(props: {onCalculate: Function}){
    const [player1, setPlayer1] = useState<Player>({name: "Dealer", discountFactor: 0.9, batna: 0, turnOrder: 1})
    const [player2, setPlayer2] = useState<Player>({name: "Marion", discountFactor: 0.5, batna: 0, turnOrder: 2})
    const [potSize, setPotSize] = useState<number>(1000)

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

    function changePlayer1DiscountFactor(event: React.ChangeEvent<HTMLInputElement>){
        //Make sure its a number
        if (!(/^\d+(\.\d*)?$/.test(event.target.value))){
            alert("Please enter a number")
            event.target.value = event.target.value.replace(/\D/g,'');
            return
        }
        setPlayer1({...player1, discountFactor: parseFloat(event.target.value)})
    }

    function changePlayer2DiscountFactor(event: React.ChangeEvent<HTMLInputElement>){
        //Make sure its a number
        if (!(/^\d+(\.\d*)?$/.test(event.target.value))){
            alert("Please enter a number")
            event.target.value = event.target.value.replace(/\D/g,'');
            return
        }
        setPlayer2({...player2, discountFactor: parseFloat(event.target.value)})
    }



    function changePotSize(event: React.ChangeEvent<HTMLInputElement>){
        //Make sure its a number
        if (!(/^\d+(\.\d*)?$/.test(event.target.value))){
            alert("Please enter a number")
            event.target.value = event.target.value.replace(/\D/g,'');
            return
        }
        setPotSize(parseFloat(event.target.value))
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
        props.onCalculate(player1,player2,potSize)
    }
    

    return (
        <div className="input-field">
            Player 1 Name: <input type="text" placeholder={player1.name} onChange={changePlayer1Name}/>
            Player 1 Discount Factor: <input type="text" placeholder={player1.discountFactor.toString()} onChange={changePlayer1DiscountFactor}/>
            Player 1 BATNA: <input type="text" placeholder={player1.batna.toString()} onChange={changePlayer1Batna}/>
            <br />
            Player 2 Name: <input type="text" placeholder={player2.name} onChange={changePlayer2Name}/>
            Player 2 Discount Factor: <input type="text" placeholder={player2.discountFactor.toString()} onChange={changePlayer2DiscountFactor}/>
            Player 2 BATNA: <input type="text" placeholder={player2.batna.toString()} onChange={changePlayer2Batna}/>
            <br />
            Who goes first? <select onChange={setTurnOrder}><option>{player1.name}</option><option>{player2.name}</option></select>
            <hr />
            Pot Size: <input type="text" placeholder={potSize.toString()} onChange={changePotSize}/>
            <br />
            <button onClick={handleCalculate} className="calculate-button">Calculate</button>

        </div>
    )
}

export default function Rubinstein() {
    const [player1, setPlayer1] = useState<Player>({name: "Dealer", discountFactor: 0.9, batna: 0, turnOrder: 1})
    const [player2, setPlayer2] = useState<Player>({name: "Marion", discountFactor: 0.5, batna: 0, turnOrder: 2})
    const [potSize, setPotSize] = useState<number>(1000)
    const [showCalculation, setShowCalculation] = useState<boolean>(false)

    function calculate(player1: Player, player2: Player, pot: number){
        setPlayer1(player1)
        setPlayer2(player2)
        setPotSize(pot)
        setShowCalculation(true)
    }

    return (
        <div className="rubinstein-bargaining">
            <h1>Rubinstein Bargaining Calculator</h1>
            <InputField onCalculate={calculate}/>
        </div>
    )
}