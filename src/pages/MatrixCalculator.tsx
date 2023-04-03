//import logo from './logo.svg';
import React, { useState } from 'react';
import EditableMatrix from '../components/EditableMatrix';
import '../styles/matrix.css'
import Dominance from '../components/Dominance';
import Matrix from '../components/Matrix';
import MatrixCalculations from '../components/MatrixCalculations';


function MatrixCalculator() {

  const [matrixData, setMatrixData] = useState<Matrix>()

  // useEffect(() => {
  //   setMatrixData(inputMatrix);
  //   console.log("Matrix Data Updated")
  //   setRenderDominance(true);
  // }, [inputMatrix]);

  function HandleCalculate(matrix: Matrix) {
    setMatrixData(matrix)
  }

  return (
    <div className="matrix-calculator">
      <h1>Matrix Calculator</h1>
        <EditableMatrix
            handleCalculate={HandleCalculate}
        />
        
        {matrixData && <MatrixCalculations
          param={matrixData.clone()}

         />}
    </div>
  );
}


export default MatrixCalculator;
