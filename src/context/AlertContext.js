// context/AlertContext.js
import React, { createContext, useContext, useState } from 'react';
import Alert from '../components/Alert';

const AlertContext = createContext();
export const useAlert = () => useContext(AlertContext);

let idCounter = 0;

export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  const showAlert = (message, type = 'success', duration = 3000) => {
    const id = idCounter++;
    setAlerts(prev => [...prev, { id, message, type, duration }]);
  };

  const removeAlert = (id) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <div className="custom-alert-container">
        {alerts.map(alert => (
          <Alert
            key={alert.id}
            id={alert.id}
            message={alert.message}
            type={alert.type}
            duration={alert.duration}
            setVisible={() => removeAlert(alert.id)}
          />
        ))}
      </div>
    </AlertContext.Provider>
  );
};
