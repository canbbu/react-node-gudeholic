// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import Layout from './components/Layout';
import AppMain from './AppMain';
// import JapanPage from './components/JapanPage'; // 예시 페이지
// import KoreaPage from './components/KoreaPage'; // 예시 페이지
import backgroundImage from './assets/frontendPhoto.jpg'; // 올바른 경로로 수정

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    minHeight: '100vh', // 화면 전체 높이
    overflowX: 'auto',
    position: 'relative',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    zIndex: -1,
    filter: 'blur(0)', // basic filter (before login)
    transition: 'filter 0.3s ease, opacity 0.3s ease',
  },
  backgroundImageLoggedIn: {
    filter: 'blur(5px)', // blur effect after login
    opacity: 0.5, // opacity after login
  },
});

function App({ classes }) {
  const [searchKeyword, setSearchKeyword] = useState('');
  const [login, setLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [items, setItems] = useState([]);

  const handleValueChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handleLogin = async (username, password) => {
    try {
      console.log("App.js: username:", username, "password:", password);
      const response = await fetch('/api/items/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // login success
        localStorage.setItem('login', 'true');
        localStorage.setItem('username', username); // user name store
        setLogin(true);
        setUsername(username);
        setErrorMessage('');

        // data fetch after login
        const itemsResponse = await fetch('/api/items', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (itemsResponse.ok) {
          const itemsData = await itemsResponse.json();
          setItems(itemsData);
        } else {
          console.error('Failed to fetch items data');
        }
      } else {
        // login fail
        setErrorMessage(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setErrorMessage('An error occurred');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('login');
    localStorage.removeItem('username');
    setLogin(false);
    setUsername('');
    setSearchKeyword('');
    setItems([]);
  };

  useEffect(() => {
    const loginStatus = localStorage.getItem('login');
    const storedUsername = localStorage.getItem('username'); // 저장된 username 가져오기
    if (loginStatus === 'true') {
      setLogin(true);
      setUsername(storedUsername);

      // data fetch after login
      fetch('/api/items')
        .then((response) => response.json())
        .then((data) => setItems(data))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <Router>
      <div className={classes.root}>
        <div
          className={`${classes.backgroundImage} ${
            login ? classes.backgroundImageLoggedIn : ''
          }`}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        <Routes>
          <Route
            path="/"
            element={
              <Layout
                login={login}
                handleLogout={handleLogout}
                searchKeyword={searchKeyword}
                handleValueChange={handleValueChange}
                handleLogin={handleLogin}
                username={username}
              />
            }
          >
            {/* initial route  to = / */}
            <Route
              index
              element={
                login ? (
                  <Navigate to="/" replace />
                ) : (
                  <div>Please Login to use</div>
                )
              }
            />
            <Route
              path="/all"
              element={
                login ? (
                  <AppMain
                    userName={username}
                    searchKeyword={searchKeyword}
                    items={items}
                  />
                ) : (
                  <div>Please Login to use</div>
                )
              }
            />
            <Route
              path="/japan"
              element={
                login ? (
                  <AppMain
                    userName={username}
                    searchKeyword={searchKeyword}
                    items={items.filter(item => item.location === '일본')}
                  />
                ) : (
                  <div>Please Login to use</div>
                )
              }
            />
            <Route
              path="/korea"
              element={
                login ? (
                  <AppMain
                    userName={username}
                    searchKeyword={searchKeyword}
                    items={items.filter(item => item.location === '한국')}
                  />
                ) : (
                  <div>Please Login to use</div>
                )
              }
            />
            {/* additional Route from here */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default withStyles(styles)(App);
