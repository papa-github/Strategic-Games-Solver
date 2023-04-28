import { useState } from "react"

const initialHeaders = ["Number choosing B", "Payoff to A", "Payoff to B"]
const initialGrid = [
    [0, 5, null],
    [1, 4, 7],
    [2, 3, 6],
    [3, 2, 5],
    [4, null, 4]
]

export default function EditableExternalityGrid(props: { handleCalculate: Function }) {
    const [inputNumber, setInputNumber] = useState("")
    const [numPlayers, setNumPlayers] = useState(4)
    const [grid, setGrid] = useState(initialGrid)


    function setPlayers(num: string) {
        // If string can be parsed to a number, set the number of players
        if (!isNaN(parseInt(num))){
            // There must be at least 2 players
            if (parseInt(num) < 2) {
                alert("There must be at least 2 players")
                return
            }
            setNumPlayers(parseInt(num))
            updateGrid(parseInt(num))
        }
        // Otherwise, alert the user
        else {
            alert("Please enter a number")
        }
    }

    function updateGrid(newPlayerCount: number) {
        const newGrid = [...grid]
        const oldPlayerCount = grid.length - 1
        // If the number of players is greater than the number of rows, add a row
        if (newPlayerCount > oldPlayerCount) {
            // Fix prior rows
            for (let i = 0; i <= oldPlayerCount; i++) {
                // If the second cell is null, set it to 0
                if (newGrid[i][1] === null) {
                    newGrid[i][1] = 0
                }
            }


            //Add a row for each new player
            for (let i = oldPlayerCount; i < newPlayerCount; i++) {
                newGrid.push([i+1, 0, 0])
            }
            // For the last added row, the second cell should be null
            newGrid[newPlayerCount][1] = null
        }
        // If the number of players is less than the number of rows, remove a row
        else if (newPlayerCount < oldPlayerCount) {
            for (let i = oldPlayerCount; i > newPlayerCount; i--) {
                newGrid.pop()
            }
            // For the last row, the second cell should be null
            newGrid[newPlayerCount][1] = null
        }
        setGrid(newGrid)
    }

    function changePayoff(rowIndex: number, cellIndex: number, value: string) {
        if (isNaN(parseInt(value)) && value !== "") {
            alert("Please enter a number")
            return
        }

        let newValue = parseInt(value)
        if(value === "") {newValue = 0}
        // Don't mutate the state directly
        const newgrid = [...grid]
        newgrid[rowIndex][cellIndex] = newValue
        setGrid(newgrid)
    }


    function generateTable(grid: (number | null)[][], headers: string[]): JSX.Element {
    return (
        <table className="externality-table">
            <thead>
                <tr>
                    {headers.map((header, index) => (
                    <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {grid.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {row.map((cell, cellIndex) => (
                    <td key={cellIndex}>{
                        // If cell is the not the first cell in the row, or null make it editable
                        cellIndex !== 0 && cell !== null ?
                        <input type="number" value={cell} onChange={(event) => changePayoff(rowIndex,cellIndex,event.target.value)}/>
                        :
                        // Otherwise, just display the cell
                        cell

                    }</td>
                    ))}
                </tr>
                ))}
            </tbody>
        </table>
    );
    }

    function handleCalculate() {
        props.handleCalculate(grid)
    }



    return (
        <div className="editable-externality-grid">
            <input type="number" placeholder={numPlayers.toString()} onChange={(e) => setInputNumber(e.target.value)}/>
            <button onClick={() => setPlayers(inputNumber)}>Set Number of Players</button>
            {generateTable(grid, initialHeaders)}
            <button className="calculate-button" onClick={handleCalculate}>Calculate</button>
        </div>
    )
}