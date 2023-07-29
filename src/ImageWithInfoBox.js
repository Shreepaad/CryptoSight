import React, { useState } from 'react';
import './App.css';
import logo from './cryptosight-logo.png';

const ImageWithInfoBox = ({infoText}) => {
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div
      className="containerz"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span class="material-symbols-outlined">info</span>

      {isHovering && <div className="info-box">{infoText}</div>}
    </div>
  );
};

export default ImageWithInfoBox;