import React, { useState } from 'react';




// eslint-disable-next-line react/prop-types, no-empty-pattern
const Matrix = ({onCalculate}) => {
  
  const [matrixData, setMatrixData] = useState([["1,2", "3,4"],["5,6", "7,8"]]);
  const [rowHeaders, setRowHeaders] = useState(["A", "B"]);
  const [colHeaders, setColHeaders] = useState(["C", "D"]);
  const [player1Name, setPlayer1Name] = useState("Player 1");
  const [player2Name, setPlayer2Name] = useState("Player 2");

  const handleCellChange = (event, rowIndex, colIndex) => {
    const newData = [...matrixData];
    newData[rowIndex][colIndex] = event.target.value;
    setMatrixData(newData);
  };

  const handleRowHeaderChange = (event, rowIndex) => {
    const newHeaders = [...rowHeaders];
    newHeaders[rowIndex] = event.target.value;
    setRowHeaders(newHeaders);
  };

  const handleColHeaderChange = (event, colIndex) => {
    const newHeaders = [...colHeaders];
    newHeaders[colIndex] = event.target.value;
    setColHeaders(newHeaders);
  };

  const handleAddRow = () => {
    setMatrixData([...matrixData, Array.from({ length: matrixData[0].length }, () => '')]);
    setRowHeaders([...rowHeaders, `Row ${matrixData.length + 1}`]);
  };

  const handleRemoveRow = (rowIndex) => {
    const newHeaders = [...rowHeaders];
    if (newHeaders.length > 1){
      const newData = [...matrixData];
      newData.splice(rowIndex, 1);
      newHeaders.splice(rowIndex, 1);
      setMatrixData(newData);
      setRowHeaders(newHeaders);
    } else{
      alert("You must have a least one row")
    }
    
  };

  const handleAddColumn = () => {
    setMatrixData((prevData) =>
      prevData.map((row) => [...row, ''])
    );
    setColHeaders([...colHeaders, `Col ${matrixData[0].length + 1}`]);
  };

  const handleRemoveColumn = (colIndex) => {
    const newHeaders = [...colHeaders];
    if (newHeaders.length > 1){
      const newData = [...matrixData];
      newData.forEach((row) => row.splice(colIndex, 1));
      newHeaders.splice(colIndex, 1);
      setMatrixData(newData);
      setColHeaders(newHeaders);
    }else{
      alert("You must have at least one column")
    }
    
  };

  const handleCalculate = () => {
    //Error checking
    const isValid = validateMatrixData(matrixData);
  
    if (!isValid) {
      alert('Input format is incorrect. Please enter numbers separated by commas.');
      return;
    }
    // Create an array of arrays that represents the matrix data
    const matrixArray = matrixData.map((row) => [...row]);
    // Send the matrix array up to the parent component (App) via a prop function
    // Here, we're calling a function called "onCalculate" that was passed as a prop to this component
    // We're passing the matrixArray as an argument to this function
    onCalculate(matrixArray);
  };

  const validateMatrixData = (matrixData) => {
    for (let i = 0; i < matrixData.length; i++) {
      for (let j = 0; j < matrixData[0].length; j++) {
        const cellValue = matrixData[i][j].trim();
        if (!/^\d+\s*,\s*\d+$/.test(cellValue)) {
          return false;
        }
        matrixData[i][j] = cellValue.replace(/\s/g, '');
      }
    }
    return true;
  };


  return (
    <div>
      <div className="matrix-container">
        <div className="player1"><input type="text" value={player1Name} onChange={(event) => setPlayer1Name(event.target.value)} /></div>
        <div className="player2"><input type="text" value={player2Name} onChange={(event) => setPlayer2Name(event.target.value)} /></div>
        <div className="matrixTable">
          <table>
            <thead>
              <tr>
                <th></th>
                {colHeaders.map((colHeader, index) => (
                  <th key={index}>
                    <input type="text" value={colHeader} onChange={(event) => handleColHeaderChange(event, index)} />
                    <button className="remove-col-btn" onClick={() => handleRemoveColumn(index)}>
                      &times;
                    </button>
                  </th>
                ))}
                <th>
                  <button className="add-col-btn" onClick={handleAddColumn}>
                    +
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {matrixData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th>
                    <input type="text" value={rowHeaders[rowIndex]} onChange={(event) => handleRowHeaderChange(event, rowIndex)} />
                  </th>
                  {row.map((cellData, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type="text"
                        value={cellData}
                        onChange={(event) => handleCellChange(event, rowIndex, colIndex)}
                        placeholder="e.g. 21,123"
                        pattern="\d+,\d+"
                        required
                      />
                    </td>
                  ))}
                  <td>
                    <button className="remove-row-btn" onClick={() => handleRemoveRow(rowIndex)}>
                      &times;
                    </button>
                  </td>
                </tr>
              ))}
              <tr>
                <td>
                  <button className="add-row-btn" onClick={handleAddRow}>
                    +
                  </button>
                </td>
                {colHeaders.map((_, index) => (
                  <td key={index}></td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
        <button onClick={handleCalculate}>Calculate</button>
      </div>
    </div>
  );
  
}


export default Matrix;