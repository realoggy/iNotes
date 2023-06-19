import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './login.css';

const backendURL = 'http://localhost:3001';

function LoginPage({ handleLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleLoginFormSubmit = async () => {
    try {
      const response = await axios.post(`${backendURL}/api/login`, {
        username,
        password,
      });

      if (response.status === 200) {
        const { user, token } = response.data;
        handleLogin(user.username); // Pass the username to the handleLogin function
        localStorage.setItem('token', token);
        localStorage.setItem('username', user.username);
        navigate('/notes');
      } else {
        console.error('Invalid username or password');
      }
    } catch (error) {
      console.error('Error occurred during login:', error);
    }
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-page">
      <div className="login-form">
        <h1>Login Page</h1>
        <form>
        <input
           type="text"
           placeholder="Username"
           value={username}
           onChange={(e) => setUsername(e.target.value)}
           className="login-input"
        />
          <br />
          <input
           type="password"
           placeholder="Password"
           value={password}
           onChange={(e) => setPassword(e.target.value)}
           className="login-input"
        />
          <br />
          <button className='login-button' type="button" onClick={handleLoginFormSubmit}>Login</button>
        </form>
        <div className="signup-link">
          Not a user? <button className="signup-button" onClick={handleSignup}>Signup now</button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
