import logo from './cryptosight-logo.png';
import './App.css';
import { Doughnut } from 'react-chartjs-2';
import { Line } from 'react-chartjs-2';
import React, { useState, useEffect, useRef } from 'react';
import { Chart, LineElement } from 'chart.js';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import $ from 'jquery'
import colorLib from '@kurkle/color';
import { LinearScale, Utils } from 'chart.js'; 
import { ArcElement, Legend, Tooltip, CategoryScale, PointElement, Filler } from 'chart.js';
import { toBePartiallyChecked, toHaveTextContent } from '@testing-library/jest-dom/matchers';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, PointElement, LinearScale, LineElement, Filler);

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
  const [data, setData] = useState([]);  // y
  const [labels, setLabels] = useState([]);  // x
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-2);
  }
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

useEffect(() => {
  if (responseData && responseData.backtest) {

    const values = responseData.backtest.charts['Strategy Equity'].Series.Equity.Values;
    const newData = [];
    const newLabels = [];

    for (const point of values) {
      if (point.hasOwnProperty('x') && point.hasOwnProperty('y')) {
        newLabels.push(point.x);
        newData.push(point.y);
      }
    }

    setData(newData)
    setLabels(newLabels)
  }
}, [responseData]);
  
  const greenGradient = document.createElement('canvas').getContext('2d');
  const gradient = greenGradient.createLinearGradient(0, 0, 0, 200);
  gradient.addColorStop(0, '#1af58a');
  gradient.addColorStop(1, 'green');

  const grayGradient = document.createElement('canvas').getContext('2d');
  const gradient2 = grayGradient.createLinearGradient(0, 0, 0, 200);
  gradient2.addColorStop(0, '#545456');
  gradient2.addColorStop(1, '#bfbfbf'); 

  const greenGradient2 = document.createElement('canvas').getContext('2d');
  const gradient3 = greenGradient2.createLinearGradient(0, 0, 0, 300);
  gradient3.addColorStop(1, '#ffffff');
  gradient3.addColorStop(0, '#C1FFC1'); 

  function transparentize(value) {
    var alpha = 0.95 === undefined ? 0.5 : 1 - 0.95;
    return colorLib(value).alpha(alpha).rgbString();
  }

  function TransparentizedLineChart({ data }) {
    return (
      <Line
        data={{
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            fill: 'origin',
            data: data,
            borderColor: gradient,
            tension: .3,
            backgroundColor: gradient3,
            pointRadius: 0,
          }]
        }}
        options={{
          maintainAspectRatio: false,
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Price of Crypto"
            }
          },
          scales: {
            x: {
              display: false
            },
            y: {
              display: false
            }
          }
        }}
      />
    );
  }

  const centerLabelPlugin = {
    id: 'center-label',
    beforeDraw: (chart) => {
      const width = chart.width;
      const height = chart.height;
      const ctx = chart.ctx;

      ctx.restore();
      const fontSize = 3;
      ctx.font = fontSize + 'em Poppins';
      ctx.textBaseline = 'middle';

      const text = '10';
      const textX = Math.round((width - ctx.measureText(text).width) / 2)- 15;
      const textY = height / 2 + 10;
      ctx.fillStyle = 'black';
      ctx.fillText(text, textX, textY);
      ctx.fillStyle = '#545456';
      ctx.fillText('%', textX + ctx.measureText(text).width, textY);
      
      ctx.save();
    },
  };

  const centerLabelPlugin2= {
    id: 'center-label2',
    beforeDraw: (chart) => {
      const width = chart.width;
      const height = chart.height;
      const ctx = chart.ctx;

      ctx.restore();
      const fontSize = 3;
      ctx.font = fontSize + 'em Poppins';
      ctx.textBaseline = 'middle';

      const text = '40';
      const textX = Math.round((width - ctx.measureText(text).width) / 2)- 15;
      const textY = height / 2 + 10;
      ctx.fillStyle = 'black';
      ctx.fillText(text, textX, textY);
      ctx.fillStyle = '#545456';
      ctx.fillText('%', textX + ctx.measureText(text).width, textY);
      
      ctx.save();
    },
  };

  return (
    isLoading ? (
      <div>Loading...</div>
    ) : (
      <div className="App">
      <div className="header" onClick={handleBack}><img src= {logo}/></div>
      <div className="boxes">
        <div className="b1">
        <div className="p1">
          <h1 className="txt">Compounding Annual Return</h1>
          <div className="donut" >
            <Doughnut
              data = {{
                labels: [],
                datasets: [
                  {
                    data: [90, 10],
                    backgroundColor: [gradient, gradient2],
                    hoverOffset: 5,
                    cutout: 70,
                    borderRadius: 50,
                    offset: 10,
                  },
                ],
              }}
              plugins={[centerLabelPlugin]}
            />
          </div>
          <p>Projected profit of <span style={{ color: 'green' }}>$10,000</span> over a year</p>
          </div>
          <div className='v-line'></div>
          <div className="p2">
          <h1 className="txt2">Win Ratio</h1>
          <div className="donut2" >
            <Doughnut
              data = {{
                labels: [],
                datasets: [
                  {
                    data: [40, 50],
                    backgroundColor: [gradient, gradient2],
                    hoverOffset: 5,
                    cutout: 70,
                    borderRadius: 50,
                    offset: 10,
                  },
                ],
              }}
              plugins={[centerLabelPlugin2]}
            />
          </div>
          </div>

        </div>
        <div className="b2">
        <div className='h-line'></div>
              <p>Algorithm: </p>
              <div className='h-line'></div>
              <p>Crypto: </p>
              <div className='h-line'></div>
              <p>Strategy: </p>
              <div className='h-line'></div>
              <p>Best Cryptos: </p>
              <div className='h-line'></div>



        </div>
        <div className="b3"></div>
      </div>
      <div className="boxes2">

  


        
        <div className='chart'>
          <h1>Price of Crypto</h1>
      <Line
  data={{
    labels: labels,
    datasets: [{
      fill:'origin',
    data: data,
    borderColor: gradient,
    tension: .3,
    backgroundColor: gradient3, 
    pointRadius: 0
    }]
  }}
  options={{
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: "Price of Crypto"
      }
    },
    scales: {
      x: {
        grid: {
          drawOnChartArea:false,
        }
      },
      y: {
        grid: {
          drawOnChartArea:false,
        }
      }
    }
  }}
/>
</div>


      </div>
      <div className="boxes3">


        {/* Sharpe Ratio */}


        <div className='b4'>
          
          
          <p>Sharpe Ratio</p>
          <h1>1.8540</h1>
          <div className='c1'>
          <TransparentizedLineChart data={[65, 59, 40, 81, 56, 55, 80, 90, 180, 21, 32, 43, 80, 49, 49]} />
          </div>
          </div>


        {/* Alpha */}


          <div className='b5'>
          
          
          <p>Alpha</p>
          <h1>0.1699</h1>
          <div className='c1'>
          <TransparentizedLineChart data={[65, 59, 40, 81, 56, 55, 80, 90, 180, 21, 32, 43, 80, 49, 49]} />
          </div>
          </div>



          {/* Beta */}




          <div className='b6'>
          
          
          <p>Beta</p>
          <h1>-0.0144</h1>
          <div className='c1'>
          <TransparentizedLineChart data={[1000, 59, 40, 81, 56, 55, 80, 90, 180, 21, 32, 43, 80, 49, 49]} />
          </div>
          </div>
  </div>
  <div className='boxes4'>
  <div className='b3'></div>
  <div className='b8'></div>

  </div>
    </div>
    )
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
