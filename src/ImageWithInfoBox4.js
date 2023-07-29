import React, { useState } from 'react';
import './App.css';
import logo from './cryptosight-logo.png';

const ImageWithInfoBox4 = ({infoText4}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="containerz4"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span class="material-symbols-outlined">info</span>

      {isHovering && <div className="info-box4">{infoText4}</div>}
    </div>
  );
};

export default ImageWithInfoBox4;