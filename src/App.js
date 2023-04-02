//import logo from './logo.svg';
import './App.css';
import React from 'react';
import Matrix from './components/Matrix';

function App() {

  // eslint-disable-next-line no-unused-vars
  const handleCalculate = (matrixArray) => {
    console.log(matrixArray)
  }
  return (
    <div className="App">
      <h1>Matrix Calculator</h1>
      <Matrix onCalculate={handleCalculate}/>
    </div>
  );
}

export default App;
