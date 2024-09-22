// Layout.js
import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AdminLogin from './components/AdminLogin';

// Styled components
const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    [theme.breakpoints.up('sm')]: {
      width: '12ch',
      '&:focus': {
        width: '20ch',
      },
    },
  },
}));

function Layout({ login, handleLogout, searchKeyword, handleValueChange, handleLogin, username }) {
  return (
    <div>
      {/* Toolbar가 있는 AppBar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              GudeHolic System
            </Typography>
            {login ? (
              <React.Fragment>
                {/* 로그인 상태일 때 툴바에 검색창과 로그아웃 버튼 */}
                <Search>
                  <SearchIconWrapper>
                    <SearchIcon />
                  </SearchIconWrapper>
                  <StyledInputBase
                    inputProps={{ 'aria-label': 'search' }}
                    name="searchKeyword"
                    value={searchKeyword}
                    onChange={handleValueChange}
                  />
                </Search>
                <Button variant="contained" color="primary" onClick={handleLogout}>
                  로그아웃
                </Button>
              </React.Fragment>
            ) : (
              <AdminLogin handleLogin={handleLogin} />
            )}
          </Toolbar>
        </AppBar>
      </Box>

      {/* 페이지에 따라 변하는 콘텐츠는 Outlet에 렌더링 */}
      <Outlet />
    </div>
  );
}

export default Layout;
