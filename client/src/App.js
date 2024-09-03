import React from 'react';
import Customer from './components/Customer';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { withStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
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
};

const customers = [
  {
    id: '1',
    img: 'https://source.unsplash.com/user/max_duz/300x300',
    name: 'young',
    age: '33',
    job: 'react engineer',
  },
  {
    id: '2',
    img: 'https://placeimg.com/64/64/any',
    name: 'jisu',
    age: '31',
    job: 'my girlfriend',
  },
  {
    id: '3',
    img: 'https://placeimg.com/64/64/any',
    name: 'goduck',
    age: '33',
    job: 'friend',
  },
];

function App(props) {
  const { classes } = props;
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
          {customers.map(customer => (
            <Customer
              key={customer.id}
              id={customer.id}
              img={customer.img}
              name={customer.name}
              age={customer.age}
              job={customer.job}
            />
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export default withStyles(styles)(App);
