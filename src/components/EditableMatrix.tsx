import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Matrix from './Matrix';




// eslint-disable-next-line react/prop-types, no-empty-pattern
const EditableMatrix = (props: {handleCalculate: Function}) => {

  

  const [matrixData, setMatrixData] = useState<string[][]>([["1,2", "3,4"],["5,6", "7,8"],])
  const [rowHeaders, setRowHeaders] = useState<string[]>(["A", "B"])
  const [colHeaders, setColHeaders] = useState<string[]>(["C", "D"])
  const [player1Name, setPlayer1Name] = useState<string>("Player 1")
  const [player2Name, setPlayer2Name] = useState<string>("Player 2")

  

  const handleCellChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number, colIndex: number) => {
    const newData = [...matrixData];
    newData[rowIndex][colIndex] = event.target.value;
    setMatrixData(newData);
    
  };

  const handleRowHeaderChange = (event: React.ChangeEvent<HTMLInputElement>, rowIndex: number) => {
    const newHeaders = [...rowHeaders];
    newHeaders[rowIndex] = event.target.value;
    setRowHeaders(newHeaders);
    
  };

  const handleColHeaderChange = (event: React.ChangeEvent<HTMLInputElement>, colIndex: number) => {
    const newHeaders = [...colHeaders];
    newHeaders[colIndex] = event.target.value;
    setColHeaders(newHeaders);
    
  };

  const handleAddRow = () => {
    setMatrixData([...matrixData, Array.from({ length: matrixData[0].length }, () => '')]);
    setRowHeaders([...rowHeaders, `Row ${matrixData.length + 1}`]);
    
  };

  const handleRemoveRow = (rowIndex: number) => {
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

  const handleRemoveColumn = (colIndex: number) => {
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




  function handleCalculate(): void {
    try {
      let inputMatrix = new Matrix(matrixData,rowHeaders,colHeaders,player1Name,player2Name)
      props.handleCalculate(inputMatrix)
    } catch (error) {
      alert(error)
    }
    
  }

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
        <div className='calculate-button-container'><button className="calculate-button" onClick={handleCalculate}>Calculate</button></div>
      </div>
    </div>
  );
  
}


export default EditableMatrix;