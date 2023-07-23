import logo from './cryptosight-logo.png';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Chart, LineController, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
Chart.register(LineController, LinearScale, CategoryScale, PointElement, LineElement);

function AlgorithmPage({ setSelectedAlgorithm }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selected, setSelected] = useState('Select an algorithm');
  const [dropdownHeight, setDropdownHeight] = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (dropdownVisible && dropdownRef.current) {
      setDropdownHeight(dropdownRef.current.getBoundingClientRect().height);
    }
  }, [dropdownVisible]);

  const handleAlgorithmChange = (event) => {
    setSelectedAlgorithm(event.target.textContent);
    setSelected(event.target.textContent);
    setDropdownVisible(false);
  }

  return (
    <div className="container">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Logo" />
      </div>
      <div className="dropdown" onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={() => setDropdownVisible(false)}>
        <button className="algotxt">{selected}</button>
        <div className="dropdown-content" ref={dropdownRef} style={{display: dropdownVisible ? 'block' : 'none'}}>
          <button onClick={handleAlgorithmChange} className="algorithm">first</button>
          <button onClick={handleAlgorithmChange} className="algorithm">second</button>
          <button onClick={handleAlgorithmChange} className="algorithm">third</button>
          <button onClick={handleAlgorithmChange} className="algorithm">fourth</button>
          <button onClick={handleAlgorithmChange} className="algorithm">fifth</button>
        </div>
      </div>
      <Link to="/crypto" className="next-link" style={{marginTop: dropdownVisible ? `${dropdownHeight + 20}px` : '50px'}}>Next</Link>
    </div>
  );
}

function CryptoPage({ setSelectedCrypto }) {
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selected, setSelected] = useState('Select a Crypto');

  const handleCryptoChange = (event) => {
    setSelectedCrypto(event.target.textContent);
    setSelected(`${event.target.textContent} selected`);
    setDropdownVisible(false);
  }

  return (
    <div className="container">
      <div className="logo-container">
        <img src={logo} className="logo" alt="Logo" />
      </div>
      <div className="dropdown" onMouseEnter={() => setDropdownVisible(true)} onMouseLeave={() => setDropdownVisible(false)}>
        <button className="cryptotxt">{selected}</button>
        <div className="dropdown-content" style={{display: dropdownVisible ? 'block' : 'none'}}>
          <button onClick={handleCryptoChange} className="btc">Bitcoin</button>
          <button onClick={handleCryptoChange} className="eth">Ethereum</button>
          <button onClick={handleCryptoChange} className="tet">Tether</button>
          <button onClick={handleCryptoChange} className="xrp">XRP</button>
          <button onClick={handleCryptoChange} className="bnb">BNB</button>
        </div>
      </div>
      <Link to="/stats" className="next-link" style={{marginTop: dropdownVisible ? '200px' : '70px'}}>Next</Link>
    </div>
  );
}

function LineChart({ data, labels }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: 'rgba(0, 123, 255, 0.1)',
          borderColor: 'rgba(0, 123, 255, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });

    return () => chart.destroy();
  }, [data, labels]);

  return <canvas ref={canvasRef}></canvas>;
}

function StatisticsPage({ selectedAlgorithm, selectedCrypto }) {
  const data = [12, 19, 3, 5, 2, 3];  // dummy data
  const labels = ['January', 'February', 'March', 'April', 'May', 'June'];  // dummy labels

  return (
    <div className="container">
      <h1>Trading Statistics</h1>
      <p>Algorithm: {selectedAlgorithm}</p>
      <p>Crypto: {selectedCrypto}</p>
      <div style={{ height: '400px', width: '100%' }}>
        <LineChart data={data} labels={labels} />
      </div>
      <Link to="/crypto" className="back-link">Back</Link>
    </div>
  );
}


function App() {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState('');
  const [selectedCrypto, setSelectedCrypto] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/crypto" element={<CryptoPage setSelectedCrypto={setSelectedCrypto} />} />
        <Route path="/stats" element={<StatisticsPage selectedAlgorithm={selectedAlgorithm} selectedCrypto={selectedCrypto} />} />
        <Route path="/" element={<AlgorithmPage setSelectedAlgorithm={setSelectedAlgorithm} />} />
      </Routes>
    </Router>
  );
}

export default App;
