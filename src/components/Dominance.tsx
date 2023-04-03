import React from 'react';
import Matrix from './Matrix';

function Dominance(props: { matrix: Matrix}) {
    const thisMatrix:Matrix = props.matrix

    console.log("Received matrix in Dominance")
    console.log(thisMatrix)

    const steps: [string, JSX.Element][] = [["Starting Matrix", thisMatrix.display()]]; //Each step contains a message (" A dominated by B", and a Matrix (The prev matrix with row/col A removed))
  
    let cellRemoved = true
    let currentMatrix = thisMatrix
    //Attempt 2
    while (cellRemoved){
        cellRemoved = false;

        let removedRows = []
        for (const [row_index, row] of currentMatrix.getPlayer1Payoffs().entries()){
            for (const [otherrow_index, otherrow] of currentMatrix.getPlayer1Payoffs().entries()){
                if (row === otherrow) continue
                if (row.every((val, index) => val > otherrow[index])){
                    //row is Strictly dominant
                    removedRows.push([row_index,otherrow_index]);//queue other row for removal
                    //Notify while loop that a cell has been removed
                    cellRemoved = true;
                }
            }
        }
        removedRows.map(num => {
            let message = ` ${currentMatrix.player1Name}: ${currentMatrix.rowHeaders[num[1]]} is strictly dominated by ${currentMatrix.rowHeaders[num[0]]}`
            currentMatrix.removeRow(num[1]); //Remove Row from Matrix
            //Add message to steps
            steps.push([message, currentMatrix.clone().display()])
        })
    
        let removedCols: [number, number][] = []
        for (const [col_index, col] of currentMatrix.getPlayer2Payoffs().entries()){
            for (const [othercol_index, othercol] of currentMatrix.getPlayer2Payoffs().entries()){
                if (col === othercol) continue
                if (col.every((val, index) => val > othercol[index])){
                    //Col is Strictly dominant
                    removedCols.push([col_index,othercol_index]) //queue other col for removal
                    //Notify while loop that a cell has been removed
                    cellRemoved = true;
                }
            }
        }
        removedCols.map(num => {
            let message = ` ${currentMatrix.player2Name}: ${currentMatrix.colHeaders[num[1]]} is strictly dominated by ${currentMatrix.colHeaders[num[0]]}`
            currentMatrix.removeCol(num[1]); //Remove dominated column from Matrix
            //Add message to steps
        
            steps.push([message, currentMatrix.clone().display()])
        })  
    }

    return (
        <div>
            {
                steps.map((step, index) =>(
                    <div key = {index}>
                        <p>{step[0]}</p>
                        {step[1]}
                    </div>
                ))
            }
        </div>
    );
      
}

export default React.memo(Dominance) //Some optimisation, tells react that same input always returns same output
               
  