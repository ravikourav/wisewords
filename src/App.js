import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header.js';
import { useContext } from 'react';
import Loading from './components/Loading.js';
import { AuthContext } from './hooks/AuthContext.js';

function App() {
  const { isLoading } = useContext(AuthContext);
  return (
    isLoading ? <Loading /> :
    <div className="App no-blinker">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
