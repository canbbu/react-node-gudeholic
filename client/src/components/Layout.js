// Layout.js
import React, { useState } from 'react';
import { Outlet, useNavigate,Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Button, Box, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import AdminLogin from './AdminLogin';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';

const styles = theme => ({
  toggleButtonGroup: {
    margin: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing(1, 2),
    backgroundColor: '#f5f5f5',
  },
  logoutButton: {
    marginLeft: theme.spacing(2),
  },
});

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
  const [anchorEl, setAnchorEl] = useState(null);
  const [alignment, setAlignment] = useState('ALL');
  const navigate = useNavigate();


  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleToggleChange = (event, newAlignment) => {
    setAlignment(newAlignment);
    handleMenuClose();

    // Navigate to the respective pages based on the selection
    switch (newAlignment) {
      case 'ALL':
        navigate('/all');
        break;
      case 'KOREA':
        navigate('/korea');
        break;
      case 'JAPAN':
        navigate('/japan');
        break;
      default:
        break;
    }
  };

  return (
    <div>
      {/* Toolbar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }} onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
            >
              {login ? (
                <MenuItem>
                  {/* Toggle Button Group in the Menu */}
                  <ToggleButtonGroup
                    value={alignment}
                    exclusive
                    onChange={handleToggleChange}
                    aria-label="text alignment"
                  >
                    <ToggleButton value="ALL" aria-label="ALL">
                      ALL
                    </ToggleButton>
                    <ToggleButton value="KOREA" aria-label="KOREA">
                      KOREA
                    </ToggleButton>
                    <ToggleButton value="JAPAN" aria-label="JAPAN">
                      JAPAN
                    </ToggleButton>
                  </ToggleButtonGroup>
                </MenuItem>
              ) : null}
            </Menu>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>  
              GudeHolic System
            </Link>
            </Typography>
            {login ? (
              <React.Fragment>
                {/* login state toolbar and toggle button  */}
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
                  Logout
                </Button>
              </React.Fragment>
            ) : (
              <AdminLogin handleLogin={handleLogin} />
            )}
          </Toolbar>
        </AppBar>
      </Box>

      {/* contents convert depends on page render on Outlet */}
      <Outlet />
    </div>
  );
}

export default Layout;
