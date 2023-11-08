import React from 'react';

const Keyboard = ({ activeKeys }) => {
  const renderKey = (keyLabel) => (
    <button className={`key ${activeKeys.includes(keyLabel.toUpperCase()) ? 'active' : ''}`}>
      {keyLabel}
    </button>
  );

  return (
    <div className="keyboard">
      {/* Function Keys Row */}
      <div className="keyboard-row">
        {['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12'].map(renderKey)}
      </div>
      {/* Number Row */}
      <div className="keyboard-row">
        {['`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace'].map(renderKey)}
      </div>
      {/* QWERTY Row */}
      <div className="keyboard-row">
        {['Tab', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\'].map(renderKey)}
      </div>
      {/* ASDF Row */}
      <div className="keyboard-row">
        {['CapsLock', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'Enter'].map(renderKey)}
      </div>
      {/* ZXCV Row */}
      <div className="keyboard-row">
        {['Shift', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'Shift'].map(renderKey)}
      </div>
      {/* Control Row */}
      <div className="keyboard-row">
        {['Ctrl', 'Win', 'Alt', 'Space', 'Alt', 'Win', 'Menu', 'Ctrl'].map(renderKey)}
      </div>
    </div>
  );
};

export default Keyboard;
