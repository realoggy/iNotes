import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './navbar.css';
import logouticon from './assets/logout.png';

function Navbar({ handleLogout }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle login
  const login = (token, username) => {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    setUser(username);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setUser(null);
    handleLogout();
    navigate('/login'); // Redirect to the login page after logout
  };

  // Check if the user is already logged in during initial render
  useEffect(() => {
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      setUser(username);
    }
  }, []); // Empty dependency array to run only once during initial render

  const handleSignup = () => {
    navigate('/signup');
    logout(); // Logout the user when signing up
  };

  const shouldShowLogoutButton = location.pathname !== '/login' && location.pathname !== '/signup';

  return (
    <div className="navbar">
      <div className="navbar-logo">
        <h1 className='logo-text'>iNotes</h1>
      </div>
      {location.pathname === '/signup' ||location.pathname === '/login'||location.pathname === '/' ?  handleSignup : (
        <button className="logout-button" onClick={handleSignup}>
            <img src={logouticon} alt="Logout" className="logout-icon" />
          Logout
        </button>
      )}
    </div>
  );
}

export default Navbar;
