import React,{ useEffect, useState } from 'react'
import './css/Alert.css';

function Alert({ message, type = 'info', duration = 3000, onClose }) {
  
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      if (onClose) {
        onClose(); // Call the onClose callback if provided
      }
    }, duration);
    return () => clearTimeout(timer); // Cleanup timer on unmount
  }, [duration, onClose]);

  if (!isVisible) return null;
  
  return (
    <div className={`custom-alert custom-alert--${type}`}>
      <span>{message}</span>
      <button className="custom-alert__close" onClick={() => setIsVisible(false)}>
        &times; {/* Close button */}
      </button>
    </div>
  )
}

export default Alert