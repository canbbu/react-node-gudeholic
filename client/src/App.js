import React from 'react';
import { Component } from 'react';
import Customer from './components/Customer';
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
  }
};

class App extends Component {

  state = {
    customers:"",
    completed:0,
  }

  componentDidMount(){
    this.timer = setInterval(this.progress, 20)
    //circularProcess 확인용
    // this.callApi()
    // .then(res => this.setState({customers:res}))
    // .catch(err => console.log(err))
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
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>아이디</TableCell>
              <TableCell>이미지</TableCell>
              <TableCell>이름</TableCell>
              <TableCell>나이</TableCell>
              <TableCell>직업</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.customers ? this.state.customers.map(customer => (
              <Customer
                key={customer.id}
                id={customer.id}
                img={customer.img}
                name={customer.name}
                age={customer.age}
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
    )
  }
  
}

export default withStyles(styles)(App);
