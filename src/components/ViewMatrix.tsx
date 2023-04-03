import React from 'react';
import PropTypes from 'prop-types';
import Matrix from './Matrix';

// eslint-disable-next-line react/prop-types, no-empty-pattern
const ViewMatrix = (matrix:Matrix) => {
  return (
    <div>
      <div className="matrix-container">
        <div className="player1">{matrix.player1Name}</div>
        <div className="player2">{matrix.player2Name}</div>
        <div className="matrixTable">
          <table>
            <thead>
              <tr>
                <th></th>
                {matrix.colHeaders.map((colHeader, index) => (
                  <th key={index}>
                    {colHeader}
                  </th>
                ))}
                <th></th>
              </tr>
            </thead>
            <tbody>
              {matrix.matrixData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th>
                    {matrix.rowHeaders[rowIndex]}
                  </th>
                  {row.map((cellData, colIndex) => (
                    <td key={colIndex}>
                      {cellData}
                    </td>
                  ))}
                  <td></td>
                </tr>
              ))}
              <tr>
                <td></td>
                {matrix.colHeaders.map((_, index) => (
                  <td key={index}></td>
                ))}
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  
}

ViewMatrix.propTypes = {
  matrixData: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)),
  rowHeaders: PropTypes.arrayOf(PropTypes.string),
  colHeaders: PropTypes.arrayOf(PropTypes.string),
  player1Name: PropTypes.string,
  player2Name: PropTypes.string,
}


export default ViewMatrix;