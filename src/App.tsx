import React from 'react';
import './App.css';
import MatrixCalculator from './pages/MatrixCalculator';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/layout';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MatrixCalculator />} />
          <Route path="About" element={<h1>Created by Papa Onwona-Agyeman</h1>} />
          <Route path="*" element={<h1>Not Found</h1>} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
