import logo from './cryptosight-logo.png';
import './App.css';
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { Chart, LineController, LinearScale, CategoryScale, PointElement, LineElement } from 'chart.js';
import { useNavigate } from "react-router-dom";
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
          <button onClick={handleAlgorithmChange} className="algorithm">LSTM Machine learning Simple Moving Average</button>
          <button onClick={handleAlgorithmChange} className="algorithm">Simple Moving Average</button>
          <button onClick={handleAlgorithmChange} className="algorithm">Momentum Trading</button>
          <button onClick={handleAlgorithmChange} className="algorithm">Reverse Trading</button>
          <button onClick={handleAlgorithmChange} className="algorithm">Pairs trading</button>
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
          <button onClick={handleCryptoChange} className="btc">BTCUSD</button>
          <button onClick={handleCryptoChange} className="eth">ETHUSD</button>
          <button onClick={handleCryptoChange} className="tet">USDT</button>
          <button onClick={handleCryptoChange} className="xrp">XRPUSD</button>
          <button onClick={handleCryptoChange} className="bnb">BNBUSD</button>
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

const findSharpeValue = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findSharpeValue(obj[key]);
      if (result !== null) return result;
    } else if (key === 'SharpeRatio' && obj[key] != 0) {
      return obj[key];
    }
  }
  return null;
};

const findPSR = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findPSR(obj[key]);
      if (result !== null) return result;
    } else if (key === 'ProbabilisticSharpeRatio' && obj[key] != 0) {
      return obj[key];
    }
  }
  return null;
};

const findAlpha = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findAlpha(obj[key]);
      if (result !== null) return result;
    } else if (key === 'Alpha' && obj[key] != 0) {
      return obj[key];
    }
  }
  return null;
};

const findBeta = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findBeta(obj[key]);
      if (result !== null) return result;
    } else if (key === 'Beta' && obj[key] != 0) {
      return obj[key];
    }
  }
  return null;
};


const findCAR = (obj) => {
  for (const key in obj) {
    if (typeof obj[key] === 'object') {
      const result = findCAR(obj[key]);
      if (result !== null) return result;
    } else if (key === 'CompoundingAnnualReturn' && obj[key] != 0) {
      return obj[key];
    }
  }
  return null;
};

function StatisticsPage({ selectedAlgorithm, selectedCrypto }) {
  const [responseData, setResponseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
  $.ajax({
    url: '/sim',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        selectedAlgorithm: selectedAlgorithm,
        selectedCrypto: selectedCrypto,
      }),
      beforeSend: function () {
        setIsLoading(true);
      },
      success: function (response) {
        setIsLoading(false);
        setResponseData(response.value); // Save the specific data from the response
      },
  })
}, [selectedAlgorithm, selectedCrypto]);
  const navigate = useNavigate();
  const data = [12, 19, 3, 5, 2, 3];  // dummy data
  const labels = ['January', 'February', 'March', 'April', 'May', 'June'];  // dummy labels

  const handleBack = () => {
    navigate(-2);
  }

  return (
  {isLoading ? (
        <div>Loading...</div>
      ) : (
    
    <div className="container">
      <h1>Trading Statistics:</h1>
      <div className="widget">
        <h2>Algorithm</h2>
        <p>{selectedAlgorithm}</p>
      </div>
      <div className="widget">
        <h2>Crypto</h2>
        <p>{selectedCrypto}</p>
      </div>
      <div className="widget chart-widget">
        <LineChart data={data} labels={labels} />
      </div>
      <div className="widget table-widget">
        <h2>PSR:</h2>
        <p>{findPSR(responseData.backtest)}</p>
        <h2>Sharpe Ratio:</h2>
        <p>{findSharpeValue(responseData.backtest)}</p>
        <h2>Compounding Annual Return:</h2>
        <p>{findCAR(responseData.backtest)}</p>
        <h2>Alpha:</h2>
        <p>{findAlpha(responseData.backtest)}</p>
        <h2>Beta:</h2>
        <p>{findBeta(responseData.backtest)}</p>
      </div>
      <button onClick={handleBack} className="back-link">Back</button>
    </div>
  )}
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
