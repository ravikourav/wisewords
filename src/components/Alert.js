import React, { useEffect } from 'react';
import './css/Alert.css';

function Alert({ message, type = 'info', duration = 3000, setVisible, visible }) {

  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        setVisible(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, duration, setVisible]);

  if (!visible) return null;

  return (
    <div className={`custom-alert custom-alert--${type}`}>
      <span>{message}</span>
      <button className="custom-alert__close" onClick={() => setVisible(false)}>
        &times;
      </button>
    </div>
  );
}

export default Alert;
