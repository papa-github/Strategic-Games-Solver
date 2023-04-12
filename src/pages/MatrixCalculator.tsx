//import logo from './logo.svg';
import React, { useState } from 'react';
import EditableMatrix from '../mc-components/EditableMatrix';
import '../styles/matrix.css'
import Matrix from '../mc-components/Matrix';
import MatrixCalculations from '../mc-components/MatrixCalculations';
import '../styles/MatrixCalculator.css'


function MatrixCalculator() {

  const [matrixData, setMatrixData] = useState<Matrix>()


  function HandleCalculate(matrix: Matrix) {
    setMatrixData(matrix)
    console.log("Setting Matrix Data", matrix)
  }

  return (
    <div className="matrix-calculator">
      <h1>Matrix Calculator</h1>
        <EditableMatrix
            handleCalculate={HandleCalculate}
        />
        
        {matrixData && <MatrixCalculations
          inputMatrix={matrixData.clone()}

         />}
    </div>
  );
}


export default MatrixCalculator;
