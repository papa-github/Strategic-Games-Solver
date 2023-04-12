import Matrix from './Matrix';

function Dominance(matrix: Matrix): [Matrix, JSX.Element] {
    const thisMatrix:Matrix = matrix.clone(); //Clone matrix to prevent mutation of original matrix

    const steps: [string, JSX.Element][] = [["Starting Matrix", thisMatrix.display()]]; //Each step contains a message (" A dominated by B", and a Matrix (The prev matrix with row/col A removed))
  
    let cellRemoved = true
    let currentMatrix = thisMatrix
    //Attempt 2
    while (cellRemoved){
        cellRemoved = false;

        let removedRows = []
        let dominatedRows: number[] = []
        for (const [row_index, row] of currentMatrix.getPlayer1Payoffs().entries()){
            if (dominatedRows.includes(row_index)) continue
            for (const [otherrow_index, otherrow] of currentMatrix.getPlayer1Payoffs().entries()){
                if (row === otherrow || dominatedRows.includes(otherrow_index)) continue
                if (row.every((val, index) => val > otherrow[index])){
                    //row strictly dominates otherrow
                    removedRows.push([row_index,otherrow_index]);//queue other row for removal
                    dominatedRows.push(otherrow_index)
                    //Notify while loop that a cell has been removed
                    cellRemoved = true;
                }
            }
        }

        let rowHeaderCopy = [...currentMatrix.rowHeaders]
        // eslint-disable-next-line array-callback-return
        removedRows.map(num => {
            let message = ` ${currentMatrix.player1Name}: ${rowHeaderCopy[num[1]]} is strictly dominated by ${rowHeaderCopy[num[0]]}`
            currentMatrix.removeRow(rowHeaderCopy[num[1]]); //Remove Row from Matrix
            //Add message to steps
            steps.push([message, currentMatrix.clone().display()])
        })
    

        //Remove dominated columns
        let removedCols: [number, number][] = []
        let dominatedCols: number[] = []
        for (const [col_index, col] of currentMatrix.getPlayer2Payoffs().entries()){
            if (dominatedCols.includes(col_index)) continue
            for (const [othercol_index, othercol] of currentMatrix.getPlayer2Payoffs().entries()){
                if (col === othercol || dominatedCols.includes(othercol_index)) continue
                if (col.every((val, index) => val > othercol[index])){
                    //Col is Strictly dominant
                    removedCols.push([col_index,othercol_index]) //queue other col for removal
                    dominatedCols.push(othercol_index)
                    //Notify while loop that a cell has been removed
                    cellRemoved = true;
                }
            }
        }
        
        let colHeaderCopy = [...currentMatrix.colHeaders]
        // eslint-disable-next-line array-callback-return
        removedCols.map(num => {
            let message = ` ${currentMatrix.player2Name}: ${colHeaderCopy[num[1]]} is strictly dominated by ${colHeaderCopy[num[0]]}`

            currentMatrix.removeCol(colHeaderCopy[num[1]]); //Remove dominated column from Matrix

            //Add message to steps
            steps.push([message, currentMatrix.clone().display()])
        })  
    }
    
    return ([currentMatrix,
        <div>
            <h3> Eliminate strictly dominated strategies to reduce the payoff matrix:</h3>
            {
                steps.map((step, index) =>(
                    <div key = {index}>
                        <p><em>{step[0]}</em></p>
                        {step[1]}
                    </div>
                ))
            }
        </div>
    ]);
      
}

export default Dominance //Some optimisation, tells react that same input always returns same output
               
  