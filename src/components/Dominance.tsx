import React from 'react';
import PropTypes from 'prop-types';
import ViewMatrix from './ViewMatrix';
import Matrix from './Matrix';

function Dominance(props: { matrix: Matrix}) {
    const thisMatrix:Matrix = props.matrix

    console.log("Received matrix in Dominance")
    console.log(thisMatrix)

    const steps: any[][] = [[]]; //Each step contains a message (" A dominated by B", and a Matrix (The prev matrix with row/col A removed))
    steps.push([
        "Starting Matrix",
        ViewMatrix(thisMatrix)
    ]);
  
    let cellRemoved = true
    let currentMatrix = thisMatrix
    //Attempt 2
    while (cellRemoved){
        cellRemoved = false;

        let removedRows = []
        for (const row of currentMatrix.getPlayer1Payoffs()){
            for (const [otherrow_index, otherrow] of currentMatrix.getPlayer1Payoffs().entries()){
                if (row === otherrow) continue
                if (row.every((val, index) => val > otherrow[index])){
                    //row is Strictly dominant
                    removedRows.push(otherrow_index) //queue other row for removal
                    cellRemoved = true;
                }
            }
        }
        removedRows.map(num => currentMatrix.removeRow(num))
    
        let removedCols = []
        for (const col of currentMatrix.getPlayer2Payoffs()){
            for (const [othercol_index, othercol] of currentMatrix.getPlayer2Payoffs().entries()){
                if (col === othercol) continue
                if (col.every((val, index) => val > othercol[index])){
                    //Col is Strictly dominant
                    removedCols.push(othercol_index) //queue other col for removal
                    cellRemoved = true;
                }
            }
        }
        removedCols.map(num => currentMatrix.removeCol(num))        
    }

    console.log("output"); console.log(currentMatrix)

    return (
        <div>
            {ViewMatrix(currentMatrix)}
        </div>
        // <div>
        //   {steps.map((step, index) => (
        //     <div key={index}>
        //       <p>{step[0]}</p>
        //       {step[1]}
        //     </div>
        //   ))}
        // </div>
    );
      
}

export default Dominance
               
  