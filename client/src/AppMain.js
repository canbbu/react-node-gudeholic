import React, { useState, useEffect, useCallback } from 'react';
import Item from './components/Item';
import ItemAdd from './components/ItemAdd';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { makeStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

const theme = createTheme();

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 1080,
  },
  progress: {
    marginTop: theme.spacing(2),
  },
  menu: {
    marginTop: 15,
    marginBottom: 15,
    display: 'flex',
    justifyContent: 'center',
  },
  paper: {
    marginLeft: 18,
    marginRight: 18,
    minWidth: 1080,
  },
}));

function AppMain({ searchKeyword, userName, items }) {
  const classes = useStyles();
  const [completed, setCompleted] = useState(0);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const stateRefresh = useCallback(() => {
    // state refresh code
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCompleted((prevCompleted) => (prevCompleted >= 100 ? 0 : prevCompleted + 1));
    }, 20);
    
    return () => {
      clearInterval(timer); // Cleanup timer
    };
  }, []);

  useEffect(() => {
    setSortKey(searchKeyword);
  }, [searchKeyword]);

  const filteredAndSortedData = useCallback(
    (data) => {
      let filteredData = data.filter((c) =>
        c.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );

      if (sortKey) {
        filteredData = filteredData.sort((a, b) => {
          let valueA = a[sortKey];
          let valueB = b[sortKey];

          if (sortKey === 'purchasePrice' || sortKey === 'soldPrice') {
            const numericA = parseFloat(valueA.replace(/[^0-9.-]+/g, ''));
            const numericB = parseFloat(valueB.replace(/[^0-9.-]+/g, ''));

            if (!isNaN(numericA) && !isNaN(numericB)) {
              return sortDirection === 'asc' ? numericA - numericB : numericB - numericA;
            }

            if (isNaN(numericA)) return 1;
            if (isNaN(numericB)) return -1;

            return 0;
          }

          const stringA = String(valueA);
          const stringB = String(valueB);
          
          return sortDirection === 'asc'
            ? stringA.localeCompare(stringB)
            : stringB.localeCompare(stringA);
        });
      }

      return filteredData;
    },
    [searchKeyword, sortKey, sortDirection]
  );

  const handleSort = (key) => {
    let newDirection = 'asc';
    if (sortKey === key) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }
    setSortKey(key);
    setSortDirection(newDirection);
  };

  const renderItems = useCallback(() => {
    const filteredAndSorted = filteredAndSortedData(items);

    if (!Array.isArray(filteredAndSorted)) {
      console.error("filteredAndSortedData is not an array:", filteredAndSorted);
      return null;
    }

    return filteredAndSorted.map((item) => (
      <Item
        key={item._id}
        id={item._id}
        image={item.image}
        name={item.name}
        size={item.size}
        purchasePrice={item.purchasePrice}
        soldPrice={item.soldPrice}
        location={item.location}
        isSold={item.isSold}
        purchaseDate={item.purchaseDate}
        userName={userName}
        stateRefresh={stateRefresh}
      />
    ));
  }, [filteredAndSortedData, items, userName, stateRefresh]);

  const cellList = [
    { key: 'edit', label: '편집', sortable: false },
    { key: 'image', label: '이미지', sortable: false },
    { key: 'name', label: '이름', sortable: true },
    { key: 'size', label: '사이즈', sortable: true },
    { key: 'purchasePrice', label: '구매가격', sortable: true },
    { key: 'soldPrice', label: '판매가격', sortable: true },
    { key: 'location', label: '재고 장소', sortable: true },
    { key: 'isSold', label: '판매여부', sortable: true },
    { key: 'purchaseDate', label: '구매 날짜 / YYYYMMDD', sortable: true },
    { key: 'delete', label: '삭제', sortable: false },
  ];

  return (
    <ThemeProvider theme={theme}>
      <Paper className={classes.paper}>
        <div className={classes.menu}>
          <ItemAdd userName={userName} />
        </div>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              {cellList.map((c) => (
                <TableCell
                  key={c.key}
                  onClick={c.sortable ? () => handleSort(c.key) : null}
                  style={{ cursor: c.sortable ? 'pointer' : 'default' }}
                >
                  {c.label}
                  {sortKey === c.key ? (sortDirection === 'asc' ? '🔼' : '🔽') : ''}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {items.length > 0 ? (
              renderItems()
            ) : (
              <TableRow>
                <TableCell colSpan="6" align="center">
                  <CircularProgress className={classes.progress} variant="determinate" value={completed} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </ThemeProvider>
  );
}

export default AppMain;
