import React, { Component } from 'react';
import Item from './components/Item';
import ItemAdd from './components/ItemAdd';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import { withStyles } from '@mui/styles';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import './App.css';

const theme = createTheme();

const styles = theme => ({
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
});

class AppMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      completed: 0,
      searchKeyword: '', // 검색어
      sortKey: '',       // 정렬 키
      sortDirection: 'asc', // 정렬 방향
    };
  }

  stateRefresh = () => {
    this.setState({
      items: [],
      completed: 0,
      searchKeyword: '',
    });
    this.callApi()
      .then((res) => this.setState({ items: res }))
      .catch((err) => console.log(err));
  };

  componentDidMount() {
    this.timer = setInterval(this.progress, 20);
    this.callApi()
      .then((res) => this.setState({ items: res }))
      .catch((err) => console.log(err));
  }

  callApi = async () => {
    const response = await fetch('/api/items');
    const body = await response.json();
    return body;
  };

  progress = () => {
    const { completed } = this.state;
    this.setState({ completed: completed >= 100 ? 0 : completed + 1 });
  };

  componentDidUpdate(prevProps) {
    if (prevProps.searchKeyword !== this.props.searchKeyword) {
      this.setState({ searchKeyword: this.props.searchKeyword });
    }
  }

  // 필터링과 정렬 동시 적용
  filteredAndSortedData = (data) => {
    const { searchKeyword } = this.props;
    const { sortKey, sortDirection } = this.state;

    // 1. 검색어를 기준으로 필터링
    let filteredData = data.filter((c) =>
      c.name.toLowerCase().includes(searchKeyword.toLowerCase())
    );

    // 2. 정렬 적용
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
  };

  // 렌더링 함수에서 필터링 및 정렬된 데이터 사용
  renderItems = () => {
    const { items } = this.state;
    const filteredAndSortedData = this.filteredAndSortedData(items || []);

    if (!Array.isArray(filteredAndSortedData)) {
      console.error("filteredAndSortedData is not an array:", filteredAndSortedData);
      return null;
    }

    return filteredAndSortedData.map((item) => (
      <Item
        stateRefresh={this.stateRefresh}
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
        userName={this.props.userName}
      />
    ));
  };

  handleSort = (key) => {
    const { sortKey, sortDirection } = this.state;
    let newDirection = 'asc';

    if (sortKey === key) {
      newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
    }

    this.setState({
      sortKey: key,
      sortDirection: newDirection,
    });
  };

  render() {
    const { classes, userName } = this.props;
    const { completed } = this.state;
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
                    onClick={c.sortable ? () => this.handleSort(c.key) : null}
                    style={{ cursor: c.sortable ? 'pointer' : 'default' }}
                  >
                    {c.label}
                    {this.state.sortKey === c.key
                      ? this.state.sortDirection === 'asc'
                        ? '🔼'
                        : '🔽'
                      : ''}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.items.length > 0 ? (
                this.renderItems()
              ) : (
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress
                      className={classes.progress}
                      variant="determinate"
                      value={completed}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(AppMain);
