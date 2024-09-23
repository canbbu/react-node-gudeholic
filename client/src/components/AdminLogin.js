import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  hidden: {
    display: 'none',
  },
}));

function AdminLogin({ handleLogin }) {
  const classes = useStyles();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setUserName('');
    setPassword('');
    setOpen(false);
  };

  const handleValueChange = (e) => {
    const { name, value } = e.target;
    if (name === 'userName') {
      setUserName(value);
    } else if (name === 'password') {
      setPassword(value);
    }
  };

  const handleLoginClick = () => {
    console.log(`AdminLogin.js: username: ${userName}, password: ${password}`);
    handleLogin(userName, password);
    handleClose(); // dial close after login
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Login
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            label="userName"
            type="text"
            name="userName"
            value={userName}
            onChange={handleValueChange}
          />
          <br />
          <TextField
            label="password"
            type="password"
            name="password"
            value={password}
            onChange={handleValueChange}
          />
          <br />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" color="primary" onClick={handleLoginClick}>
            Login
          </Button>
          <Button variant="outlined" color="secondary" onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminLogin;
