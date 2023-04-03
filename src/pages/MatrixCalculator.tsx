//import logo from './logo.svg';
import React, { useEffect, useState } from 'react';
import EditableMatrix from '../components/EditableMatrix';
import '../styles/matrix.css'
import Dominance from '../components/Dominance';
import Matrix from '../components/Matrix';


function MatrixCalculator() {

  const [inputMatrix, setInputMatrixData] = useState<Matrix>(new Matrix());
  const [matrixData, setMatrixData] = useState<Matrix>(new Matrix())
  const [renderDominance, setRenderDominance] = useState<boolean>(false)

  useEffect(() => {
    setMatrixData(inputMatrix);
    console.log("Matrix Data Updated")
    setRenderDominance(true);
  }, [inputMatrix]);

  function HandleCalculate(matrix: Matrix) {

    setInputMatrixData(matrix);
  }

  function deactivateCalculation(){
    console.log("dc")
    setRenderDominance(false)
  }

  return (
    <div className="matrix-calculator">
      <h1>Matrix Calculator</h1>
        <EditableMatrix
            handleCalculate={HandleCalculate}
            deactivate={deactivateCalculation}
        />
        
        {renderDominance && <Dominance
          matrix={matrixData.clone()}

         />}
    </div>
  );
}


export default MatrixCalculator;
