import React from 'react';
import { Component } from 'react';
import Customer from './components/Customer';
import CustomerAdd from './components/CustomerAdd';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { withStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


const theme = createTheme()

const styles ={
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 1080,
  },
  progress:{
    marginTop : theme.spacing.unit * 2,
  },
  menu:{
    marginTop: 15,
    marginBottom: 15,
    display : 'flex',
    justifyContent: 'center',
  },
  paper:{
    marginLeft :18,
    marginRight : 18
  }
};

class App extends Component {

  constructor(props){
    super(props)
    this.state = {
      customers : '',
      completed : 0
    }
    
  }

  stateRefresh = () =>{
    this.setState({
      customers : '',
      completed : 0
    })
    this.callApi()
    .then(res => this.setState({customers:res}))
    .catch(err => console.log(err))
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20)
    //circularProcess 확인용
    this.callApi()
    .then(res => this.setState({customers:res}))
    .catch(err => console.log(err))
  }

  callApi = async () =>{
    const response = await fetch('/api/customers')
    const body = await response.json()
    return body
  }

  progress = () =>{
    const {completed} = this.state
    this.setState({ completed: completed >= 100 ? 0 : completed + 1})
  }

  render(){
    const {classes} = this.props;
    const cellList = ["번호", "프로필 이미지", "이름", "생년월일", "성별", "직업","설정"]
    return (
      <div className={classes.root}>
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
                고객 관리 시스템
              </Typography>
              <Button color="inherit">Login</Button>
            </Toolbar>
          </AppBar>
        </Box>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList.map(c =>{
                  return <TableCell className={classes.tableHead}>{c}</TableCell>
                })}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.customers ? this.state.customers.map(customer => (
                <Customer
                  stateRefresh = {this.stateRefresh}
                  key={customer.id}
                  id={customer.id}
                  image={customer.image}
                  name={customer.name}
                  birthday={customer.birthday}
                  gender={customer.gender}
                  job={customer.job}
                />
              )) : 
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progress} varient="determinate" value={this.state.completed}/>
                </TableCell>
              </TableRow>
            }
            </TableBody>
          </Table>
        </Paper>
        <div className={classes.menu}>
          <CustomerAdd/>
        </div>
      </div>
    )
  }
  
}

export default withStyles(styles)(App);
