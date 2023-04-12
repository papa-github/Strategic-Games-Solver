import React from 'react';
import './App.css';
import MatrixCalculator from './pages/MatrixCalculator';
import { Routes, Route, HashRouter } from "react-router-dom";
import Header from './pages/Header';
import ExternalityCalculator from './pages/ExternalityCalculator';
import LemonsAndOranges from './pages/LemonsAndOranges';
import DecreasingSurplus from './pages/DecreasingSurplus';
import Rubinstein from './pages/Rubinstein';
import SeparatingPooling from './pages/SeparatingPooling';
import Footer from './pages/Footer';
import RollbackEquilibrium from './pages/RollbackEquilibrium';

export default function App() {
  return (
    <HashRouter>
    <Header />
      <Routes>
        <Route path='/' element={<MatrixCalculator />} />
        <Route path='/MatrixCalculator' element={<MatrixCalculator />} />
        <Route path='/RollbackEquilibrium' element={<RollbackEquilibrium />} />
        <Route path='/ExternalityCalculator' element={<ExternalityCalculator />} />
        <Route path='/LemonsAndOranges' element={<LemonsAndOranges />} />
        <Route path='/DecreasingSurplus' element={<DecreasingSurplus />} />
        <Route path='/Rubinstein' element={<Rubinstein />} />
        <Route path='/SeparatingPooling' element={<SeparatingPooling />} />
        <Route path="/About" element={<h1>Created by Papa Onwona-Agyeman</h1>} />
      </Routes>
    {<div className='element-above-footer'></div>}  
    <Footer/>
    </HashRouter>
  )
}

