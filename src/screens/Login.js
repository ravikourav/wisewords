import './css/Login.css';
import React, { useState , useEffect } from 'react';
import axios from 'axios';
import  { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { useAlert } from '../context/AlertContext';


function Login() {

  const { showAlert } = useAlert();
  const {login, isLoggedIn, user} = useAuth();
  const [name , setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [hasAccount, setHasAccount] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && isLoggedIn) {
      navigate(`/user/${user.username}`);
    }
  }, [user, isLoggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const endpoint = hasAccount ? `${process.env.REACT_APP_BACKEND_API_URL}/api/user/login` : `${process.env.REACT_APP_BACKEND_API_URL}/api/user/register`;
      const payload = hasAccount ? { username, password } : { name ,username, email, password };
      const response = await axios.post(endpoint, payload);

      const token = response.data.accessToken;

      if (token) {
        await login(token);
        navigate('/');
      } else {
        console.error('Token not found in response');
        showAlert('Failed to retrieve token.' , 'error');
      }
    } catch (error) {
      console.error('Operation failed', error);
      showAlert('Please check your credentials and try again.' , 'error');
    }
  };

  const alreadyHasAccount = () => {
    setHasAccount(true);
  };

  const dontHaveAccount = () => {
    setHasAccount(false);
  };

  return (
    <div className="page-root login-page">
      <div className="overlay-content">
        <div className="overlay-header">
          <img src="./logo192.png" alt="logo" className="logo" />
        </div>

        <div className="body">
          <div className="login-appname-container">
            <p className="login-model-name">Wise Men Said</p>
            <p className="login-model-slogan">"Echoes of Insight, Shared in Light"</p>
          </div>
          <form onSubmit={handleSubmit} className='login-from'>
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
            {hasAccount &&
              <div>
                <button className="forgot-button" type="button">
                  Forgotten the way?
                </button>
              </div>
            }
            <Button type='submit' text={hasAccount ? 'Log in' : 'Continue'} width={280} />
          </form>
          <p className="signup-lable">
            {hasAccount ? 'New to the wisdom? ' : 'Already a voice among us? '}
            <span className="signup-link" onClick={hasAccount ? dontHaveAccount : alreadyHasAccount}>
              {hasAccount ? 'Sign up' : 'Log in'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
