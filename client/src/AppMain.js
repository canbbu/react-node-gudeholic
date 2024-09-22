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

function AppMain({ searchKeyword, userName }) {
  const classes = useStyles();
  const [items, setItems] = useState([]);
  const [completed, setCompleted] = useState(0);
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const stateRefresh = useCallback(() => {
    setItems([]);
    setCompleted(0);
    callApi()
      .then((res) => setItems(res))
      .catch((err) => console.log(err));
  }, []);

  const callApi = async () => {
    const response = await fetch('/api/items');
    const body = await response.json();
    return body;
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCompleted((prevCompleted) => (prevCompleted >= 100 ? 0 : prevCompleted + 1));
    }, 20);
    callApi()
      .then((res) => setItems(res))
      .catch((err) => console.log(err));

    return () => {
      clearInterval(timer); // Cleanup timer
    };
  }, []);

  useEffect(() => {
    setSortKey(searchKeyword);
  }, [searchKeyword]);

  const filteredAndSortedData = useCallback(
    (data) => {
      let filteredData = data.filter((c) => c.name.toLowerCase().includes(searchKeyword.toLowerCase()));

      if (sortKey) {
        filteredData = filteredData.sort((a, b) => {
          const valueA = a[sortKey];
          const valueB = b[sortKey];

          if (valueA === undefined || valueB === undefined) return 0;
          if (sortDirection === 'asc') {
            return valueA > valueB ? 1 : -1;
          } else {
            return valueA < valueB ? 1 : -1;
          }
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
        profitPerPerson={item.profitPerPerson}
        location={item.location}
        isSold={item.isSold}
        purchaseDate={item.purchaseDate}
        updatedDate={item.updatedDate}
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
    { key: 'profitPerPerson', label: '1인당 이익', sortable: true },
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
