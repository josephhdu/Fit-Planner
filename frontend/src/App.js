import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Preferences from './components/Preferences';
import WorkoutRoutine from './components/WorkoutRoutine';
import './App.css';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/preferences" element={<Preferences />} />
          <Route path="/routine" element={<WorkoutRoutine />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;