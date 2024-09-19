import React from 'react';
import axios from 'axios'; // axios as default
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';

const styles = (theme) => ({
    hidden: {
        display: 'none',
    },
});

class ItemAdd extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            file: null,
            userName: this.props.userName,
            item: '',
            purchasePrice: '',
            location: '',
            purchaseDate: '',
            open: false,
        };
    }

    handleClickOpen = () => {
        this.setState({
            open: true,
        });
    };

    handleClose = () => {
        this.setState({
            file: null,
            userName: this.props.userName,
            item: '',
            purchasePrice: '',
            location: '',
            purchaseDate: '',
            fileName: '',
            open: false,
        });
    };

    handleFileChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileName: e.target.value,
        });
    };

    handleValueChange = (e) => {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    };

    handleFormSubmit = (e) => {
        e.preventDefault();
        this.additem()
            .then((response) => {
                console.log(response.data);
                this.props.stateRefresh();
            })
            .catch((error) => {
                console.error("There was an error!", error);
            });

        this.setState({
            file: null,
            userName: this.props.userName,
            item: '',
            purchasePrice: '',
            location: '',
            purchaseDate: '',
            fileName: '',
            open: false,
        });
        window.location.reload();
    };

    additem = () => {
        const url = '/api/items';
        const formData = new FormData();
        formData.append('userName', this.props.userName);
        formData.append('image', this.state.file);
        formData.append('item', this.state.item);
        formData.append('size', this.state.size);
        formData.append('purchasePrice', this.state.purchasePrice);
        formData.append('purchaseDate', this.state.purchaseDate);
        formData.append('location', this.state.location);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        return axios.post(url, formData, config);
    };

    render() {
        const { classes } = this.props;
        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClickOpen}
                >
                    재고 추가하기
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>재고 추가</DialogTitle>
                    <DialogContent>
                        <input
                            className={classes.hidden}
                            accept="image/*"
                            id="raised-button-file"
                            type="file"
                            onChange={this.handleFileChange}
                        />
                        <br />
                        <label htmlFor="raised-button-file">
                            <Button
                                variant="contained"
                                color="primary"
                                component="span"
                            >
                                {this.state.fileName === ''
                                    ? '프로필 이미지 삽입'
                                    : this.state.fileName}
                            </Button>
                        </label>
                        <br />
                        <TextField
                            label="아이템/브랜드.아이템.색"
                            type="text"
                            name="item"
                            value={this.state.item}
                            onChange={this.handleValueChange}
                        />
                        <br />
                        <TextField
                            label="사이즈/대문자입력"
                            type="text"
                            name="size"
                            value={this.state.size}
                            onChange={this.handleValueChange}
                        />
                        <br />
                        <TextField
                            label="구매가격/xxx엔(혹은 원)"
                            type="text"
                            name="purchasePrice"
                            value={this.state.purchasePrice}
                            onChange={this.handleValueChange}
                        />
                        <br />
                        <TextField
                            label="재고 장소/ 한국 혹은 일본"
                            type="text"
                            name="location"
                            value={this.state.location}
                            onChange={this.handleValueChange}
                        />
                        <br />
                        <TextField
                            label="구매 날짜/YYYYMMDD"
                            type="text"
                            name="purchaseDate"
                            value={this.state.purchaseDate}
                            onChange={this.handleValueChange}
                        />
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleFormSubmit}
                        >
                            추가
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.handleClose}
                        >
                            닫기
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(ItemAdd);
