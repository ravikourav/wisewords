import { Outlet } from 'react-router-dom';
import './App.css';
import Header from './components/Header.js';
import Loading from './components/Loading.js';
import { useAuth } from './context/AuthContext.js';

function App() {
  const { isLoading } = useAuth();
  return (
    isLoading ? <Loading /> :
    <div className="App no-blinker">
      <Header />
      <Outlet />
    </div>
  );
}

export default App;
