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
      items: '',
      completed: 0,
      searchKeyword: '', // 상태에 검색어 추가
    };
  }

  stateRefresh = () => {
    this.setState({
      items: '',
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

  // 검색어가 부모로부터 prop으로 전달됨
  componentDidUpdate(prevProps) {
    if (prevProps.searchKeyword !== this.props.searchKeyword) {
      this.setState({ searchKeyword: this.props.searchKeyword });
    }
  }

  filteredComponents = (data) => {
    const { searchKeyword } = this.props;
    data = data.filter((c) => c.name.indexOf(searchKeyword) > -1);
    return data.map((c) => (
      <Item
        stateRefresh={this.stateRefresh}
        key={c._id}
        id={c._id}
        image={c.image}
        name={c.name}
        purchasePrice={c.purchasePrice}
        soldPrice={c.soldPrice}
        profitPerPerson={c.profitPerPerson}
        location={c.location}
        isSold={c.isSold}
        purchaseDate={c.purchaseDate}
        upadatedDate={c.upadatedDate}
      />
    ));
  };

  render() {
    const { classes } = this.props;
    const { items, completed } = this.state;
    const cellList = [
      '편집',
      '이미지',
      '이름',
      '구매가격',
      '판매가격',
      '1인당 이익',
      '재고 장소',
      '판매여부',
      '구매 날짜',
      '최근 업데이트',
      '삭제',
    ];

    return (
      <ThemeProvider theme={theme}>
        <Paper className={classes.paper}>
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {cellList.map((c) => (
                  <TableCell className={classes.tableHead} key={c}>
                    {c}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {this.state.items ? (
                this.filteredComponents(this.state.items)
              ) : (
                <TableRow>
                  <TableCell colSpan="6" align="center">
                    <CircularProgress
                      className={classes.progress}
                      variant="determinate"
                      value={this.state.completed}
                    />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <div className={classes.menu}>
          <ItemAdd />
        </div>
      </ThemeProvider>
    );
  }
}

export default withStyles(styles)(AppMain);
