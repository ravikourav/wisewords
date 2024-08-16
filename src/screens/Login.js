import './css/Login.css';
import React, { useState,useContext } from 'react';
import axios from 'axios';
import { ReactComponent as CloseImg } from '../assets/icon/close.svg';
import  { AuthContext } from '../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import Button from '../components/Button';

function Login() {
  const [name , setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [hasAccount, setHasAccount] = useState(true);
  const navigate = useNavigate();

  const {login} = useContext(AuthContext);


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = hasAccount ? '/api/user/login' : '/api/user/register';
      const payload = hasAccount ? { username, password } : { name ,username, email, password };
      const response = await axios.post(endpoint, payload);

      console.log('Response successful', response.data);
      
      // Check if the token is available in the response
      const token = response.data.accessToken; // Use the correct key from the response

      if (token) {
        // Store token and handle authentication
        Cookies.set('authToken', token, { expires: 7, sameSite: 'None' });
        
        // Assuming you have a context or global state to manage authentication
        login(token); // Call the login function from AuthContext or similar
        // Redirect or update UI as needed
        navigate('/profile');
      } else {
        console.error('Token not found in response');
        setError('Failed to retrieve token.');
      }
    } catch (error) {
      console.error('Operation failed', error);
      setError('Please check your credentials and try again.');
    }
  };

  const onClose = () => {
    navigate('/');
  }

  const alreadyHasAccount = () => {
    setError('');
    setHasAccount(true);
  };

  const dontHaveAccount = () => {
    setError('');
    setHasAccount(false);
  };

  return (
    <div className="overlay">
      <div className="overlay-content">
        <div className="overlay-header">
          <img src="./logo192.png" alt="logo" className="logo" />
          <CloseImg onClick={onClose} className="close-button" />
        </div>

        <div className="body">
          <div className="login-appname-container">
            <p className="login-model-welcome">Welcome To</p>
            <p className="login-model-name">Wise Men Said</p>
            <p className="login-model-slogan">"Spark Minds, Share Moments"</p>
          </div>
          <form onSubmit={handleSubmit}>
            {!hasAccount && (
              <div>
                <label>Name</label>
                <input
                  className="main-input input-login"
                  type="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  name="name"
                  required
                />
              </div>
            )}
            <div>
              <label>Username</label>
              <input
                className="main-input input-login"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                name="username"
                required={!hasAccount}
              />
            </div>
            {!hasAccount && (
              <div>
                <label>Email Address</label>
                <input
                  className="main-input input-login"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  name="email"
                  required
                />
              </div>
            )}
            <div>
              <label>Password</label>
              <input
                className="main-input input-login"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                name="password"
                required
              />
            </div>
            {error && <div className='loginErr'>{error}</div>}
            {hasAccount &&
              <div>
                <button className="forgot-button" type="button">
                  Forgot Your Password?
                </button>
              </div>
            }
            <Button type='submit' text={hasAccount ? 'Log in' : 'Continue'} width={280} />
          </form>
          <button
            className="signup-button"
            type="button"
            onClick={hasAccount ? dontHaveAccount : alreadyHasAccount}
          >
            {hasAccount ? 'Not on Wise Men Said yet? Sign up' : 'Already a member? Log in'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Login;
