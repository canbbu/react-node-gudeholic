import React from 'react'
import AppLogin from './AppLogin';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { withStyles } from '@mui/styles';
import AdminLogin from './components/AdminLogin';
import { TableCell } from '@mui/material';
import backgroundImage from './assets/frontendPhoto.jpg'; // Correct path


// Define styles
const styles = theme => ({
    root: {
      width: '100%',
      marginTop: theme.spacing(3),
      overflowX: 'auto',
    },
    backgroundImage: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundImage: 'url(../public/logo192.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        zIndex: -1,
        filter: 'blur(0)', // Default filter for logged-in state
        transition: 'filter 0.3s ease, opacity 0.3s ease',
      },
      backgroundImageLoggedIn: {
        filter: 'blur(5px)', // Apply blur effect when logged in
        opacity: 0.5, // Apply transparency when logged in
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
    display: 'flex', // Flexbox 사용
    alignItems: 'center', // 수직 중앙 정렬
    justifyContent: 'center', // 수평 중앙 정렬
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

class App extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            searchKeyword: '',
            login: false,
            username: '',
            password: '',
            errorMessage: '',
            customers: [],
        };
      }
    
      handleValueChange = (e) => {
        this.setState({
          [e.target.name]: e.target.value,
        });
      };

      handleLogin = async () => {
        try {
            const response = await fetch('/api/customers/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.state.username,
                    password: this.state.password,
                }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                // 로그인 성공 시
                localStorage.setItem('login', 'true');
                localStorage.setItem('username', this.state.username); // 사용자 이름을 저장할 수 있음
                this.setState({ login: true, errorMessage: '' });
                
                // 로그인 성공 후 /api/customers로 데이터 요청
                const customersResponse = await fetch('/api/customers', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
    
                if (customersResponse.ok) {
                    const customersData = await customersResponse.json();
                    // 데이터 처리 또는 상태 업데이트
                    this.setState({ customers: customersData });
                } else {
                    console.error('Failed to fetch customers data');
                }
            } else {
                // 로그인 실패 시
                this.setState({ errorMessage: data.message || 'Login failed' });
            }
        } catch (error) {
            console.error('Error during login:', error);
            this.setState({ errorMessage: 'An error occurred' });
        }
    };

      componentDidMount() {
        const loginStatus = localStorage.getItem('login');
        if (loginStatus === 'true') {
            this.setState({ login: true });
            // 추가적으로 저장된 사용자 정보나 데이터를 로드할 수 있습니다.
        }
    }
    
    handleLogout = () => {
        localStorage.removeItem('login');
        localStorage.removeItem('username');
        this.setState({ login: false, username: '', password: '' });
    };
    

    render (){
        const { classes } = this.props;
        const { login,searchKeyword } = this.state;
        return (
            <div className={classes.root}>
                <div style={{ backgroundImage: `url(${backgroundImage})` }} className={`${classes.backgroundImage} ${login ? classes.backgroundImageLoggedIn : ''}`} />
                <Box sx={{ flexGrow: 1 }}>
                    <AppBar position="static">
                    <Toolbar>
                        <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                        >
                        <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Customer Manage System
                        </Typography>
                        {login ? (
                        <React.Fragment>
                            {/* 로그인 상태일 때 보여질 내용 */}
                            <Search>
                                <SearchIconWrapper>
                                    <div className={classes.SearchIcon}>
                                        <SearchIcon />
                                    </div>
                                </SearchIconWrapper>
                                <StyledInputBase
                                    inputProps={{ 'aria-label': 'search' }}
                                    name="searchKeyword"
                                    value={this.state.searchKeyword}
                                    onChange={this.handleValueChange}
                                />
                            </Search>
                            <br/>
                            <Button variant="contained"color="primary" onClick={this.handleLogout}>
                                로그아웃
                            </Button>
                        </React.Fragment>
                        ) : (
                            <AdminLogin handleLogin={this.handleLogin} />
                        )}
                    </Toolbar>
                    </AppBar>
                </Box>
                {login ? <AppLogin searchKeyword={searchKeyword}/> : <p></p>}
            </div>
        )
    }
}

export default withStyles(styles)(App);