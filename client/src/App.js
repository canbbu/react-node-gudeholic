// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { withStyles } from '@mui/styles';
import Layout from './Layout';
import AppMain from './AppMain';
import JapanPage from './JapanPage'; // 예시 페이지
import backgroundImage from './assets/frontendPhoto.jpg'; // 올바른 경로로 수정

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
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
    filter: 'blur(0)', // 기본 필터 (로그인 전)
    transition: 'filter 0.3s ease, opacity 0.3s ease',
  },
  backgroundImageLoggedIn: {
    filter: 'blur(5px)', // 로그인 시 블러 효과
    opacity: 0.5, // 로그인 시 투명도 적용
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
        console.log("App.js:" + "username:" + username + "password :" + password) 
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
        // 로그인 성공 시
        localStorage.setItem('login', 'true');
        localStorage.setItem('username', username); // 사용자 이름 저장
        setLogin(true);
        setUsername(username);
        setErrorMessage('');

        // 로그인 성공 후 데이터 가져오기
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
        // 로그인 실패 시
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

      // 로그인 상태면 데이터 가져오기
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
            <Route
            index
            element={login ? (
                <AppMain
                userName={username}
                searchKeyword={searchKeyword}
                items={items}
                />
            ) : (
                <div>''</div> // 로그인하지 않았을 때 보여줄 내용
            )}
            />
            <Route path="Japan" element={<JapanPage />} />
            {/* 추가적인 라우트는 여기서 정의 */}
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default withStyles(styles)(App);
