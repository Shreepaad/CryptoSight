import logo from './logo.png';
import './App.css';
import React, { useState } from 'react';

function App() {

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  }

  return (
    <div className="container">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Logo" />
      </div>
      <p className = "selecttxt">Select an algorithm:</p>
    <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
      <option value="">-- Choose an algorithm --</option>
      <option value="hursh">hursh</option>
      <option value="pika">pika</option>
      <option value="ethash">Ethash</option>
      <option value="jew">tony</option>
    </select>

    {/* Display insights based on the selected algorithm */}
    {selectedAlgorithm && (
      <div className="insights">
        {selectedAlgorithm === "ethash" ? (
          <>
            <h2>Insights for {selectedAlgorithm}</h2>
            <p>Correct choice, you will get rich</p>
          </>
        ) : selectedAlgorithm === "jew" ? (
          <>
            <h2>Insights for {selectedAlgorithm}</h2>
            <p>wrong choice</p>
          </>
        ) : (
          <>
            <h2>Insights for {selectedAlgorithm}</h2>
            <p>Wrong</p>
          </>
        )}
      </div>
    )}
  </div>
  );
}

export default App;
