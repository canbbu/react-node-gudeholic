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

class AdminLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userName:'',
            password:'',
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
            userName:'',
            password:'',
            open: false,
        });
    };


    handleValueChange = (e) => {
        const nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    };

    handleLogin = () => {
        // 부모 컴포넌트의 handleLogin 메서드 호출
        console.log("AdminLogin.js : " + "username : "+ this.state.userName + "password :" + this.state.password)
        this.props.handleLogin(this.state.userName, this.state.password);
        this.handleClose(); // 로그인 후 다이얼로그 닫기
    };


    render() {
        return (
            <div>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={this.handleClickOpen}
                >
                    Login
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClose}>
                    <DialogTitle>Login</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="userName"
                            type="text"
                            name="userName"
                            value={this.state.userName}
                            onChange={this.handleValueChange}
                        />
                        <br />
                        <TextField
                            label="password"
                            type="password"
                            name="password"
                            value={this.state.password}
                            onChange={this.handleValueChange}
                        />
                        <br />
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={this.handleLogin}
                        >
                            Login
                        </Button>
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={this.handleClose}
                        >
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default withStyles(styles)(AdminLogin);
