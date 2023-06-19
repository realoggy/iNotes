import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import { useNavigate } from 'react-router-dom';

const backendURL = 'http://localhost:3001';

const SignupForm = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${backendURL}/api/signup`, { username, email, password });
      // Handle successful signup, e.g., redirect to a success page
      console.log(response);
      navigate('/login'); // Redirect to the login page after successful signup
    } catch (error) {
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
      } else {
        setError('An error occurred during signup.');
      }
    }
  };

  return (
    <div className="signup-form-container">
      {error && <p className="signup-error">{error}</p>}
      <form className="signup-form" onSubmit={handleSignup}>
      <h1 className="signup-heading">Signup</h1>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="signup-input"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="signup-input"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="signup-input"
        />
        <button type="submit" className="signup-button">Sign Up</button>
        <p class="already-user">Already Registered? <a className='already-user2' href="./login">Login</a></p>
        </form>
      
    </div>
  );
};

export default SignupForm;
