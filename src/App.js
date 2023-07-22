import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

function App() {

  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.value);
  }

  return (
    <div className="container">
    <h1>Crypto Currency Insights</h1>
    <p>Select an algorithm:</p>
    <select value={selectedAlgorithm} onChange={handleAlgorithmChange}>
      <option value="">-- Choose an algorithm --</option>
      <option value="sha256">SHA-256</option>
      <option value="scrypt">Scrypt</option>
      <option value="ethash">Ethash</option>
      {/* Add more algorithm options here */}
    </select>

    {/* Display insights based on the selected algorithm */}
    {selectedAlgorithm && (
      <div className="insights">
        <h2>Insights for {selectedAlgorithm}</h2>
        {/* Add insights content here */}
      </div>
    )}
  </div>
  );
}

export default App;
