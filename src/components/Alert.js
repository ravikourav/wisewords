import React, { useEffect, useState } from 'react';
import './css/Alert.css';

function Alert({ message, type = 'info', duration = 3000, setVisible }) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose(); // Begin exit
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    if (exiting) return;
    setExiting(true);
    setTimeout(() => {
      setVisible(false); // Remove from state after animation
    }, 300); // Matches animation duration
  };

  return (
    <div className={`custom-alert custom-alert--${type} ${exiting ? 'slide-out' : 'slide-in'}`}>
      <span>{message}</span>
      <button className="custom-alert__close" onClick={handleClose}>
        &times;
      </button>
    </div>
  );
}
export default Alert;
