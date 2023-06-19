import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import NoteContainer from './components/notecontainer/notecontainer';
import Navbar from './components/navbar/navbar';
import LoginPage from './components/login/login';
import SignupPage from './components/signup/signup';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  useEffect(() => {
    const userLoggedIn = checkIfUserLoggedIn();
    setIsLoggedIn(userLoggedIn);
  }, []);

  const checkIfUserLoggedIn = () => {
    const token = localStorage.getItem('jwtToken');

    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp < currentTime) {
          return false;
        }

        return true;
      } catch (error) {
        console.error('Error decoding JWT token:', error);
        return false;
      }
    }

    return false;
  };

  return (
    <Router>
      <div className="App">
        <Navbar handleLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                isLoggedIn ? (
                  <Navigate to="/notes" />
                ) : (
                  <LoginPage handleLogin={handleLogin} />
                )
              }
            />
            <Route path="/login" element={<LoginPage handleLogin={handleLogin} />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/notes" element={<NoteContainer />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
