import React, { useState } from 'react';
import axios from 'axios'; // axios as default
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { withStyles } from '@mui/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const styles = (theme) => ({
    hidden: {
        display: 'none',
    },
});

function ItemAdd({ classes, userName, stateRefresh }) {
    const [file, setFile] = useState(null);
    const [item, setItem] = useState('');
    const [size, setSize] = useState('');
    const [purchasePrice, setPurchasePrice] = useState('');
    const [location, setLocation] = useState('');
    const [purchaseDate, setPurchaseDate] = useState('');
    const [fileName, setFileName] = useState('');
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setFile(null);
        setItem('');
        setSize('');
        setPurchasePrice('');
        setLocation('');
        setPurchaseDate('');
        setFileName('');
        setOpen(false);
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.value.split('\\').pop()); // 파일 이름을 가져오기
    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'item':
                setItem(value);
                break;
            case 'size':
                setSize(value);
                break;
            case 'purchasePrice':
                setPurchasePrice(value);
                break;
            case 'location':
                setLocation(value);
                break;
            case 'purchaseDate':
                setPurchaseDate(value);
                break;
            default:
                break;
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        addItem()
            .then((response) => {
                console.log(response.data);
                stateRefresh();
            })
            .catch((error) => {
                console.error("There was an error!", error);
            })
            .finally(() => {
                handleClose();
                window.location.reload();
            });
    };

    const addItem = () => {
        const url = '/api/items';
        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('image', file);
        formData.append('item', item);
        formData.append('size', size);
        formData.append('purchasePrice', purchasePrice);
        formData.append('purchaseDate', purchaseDate);
        formData.append('location', location);

        const config = {
            headers: {
                'content-type': 'multipart/form-data',
            },
        };
        return axios.post(url, formData, config);
    };

    return (
        <div>
            <Button
                variant="contained"
                color="primary"
                onClick={handleClickOpen}
            >
                재고 추가하기
            </Button>
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>재고 추가</DialogTitle>
                <DialogContent>
                    <input
                        className={classes.hidden}
                        accept="image/*"
                        id="raised-button-file"
                        type="file"
                        onChange={handleFileChange}
                    />
                    <br />
                    <label htmlFor="raised-button-file">
                        <Button
                            variant="contained"
                            color="primary"
                            component="span"
                        >
                            {fileName === ''
                                ? '프로필 이미지 삽입'
                                : fileName}
                        </Button>
                    </label>
                    <br />
                    <TextField
                        label="아이템/브랜드.아이템.색"
                        type="text"
                        name="item"
                        value={item}
                        onChange={handleValueChange}
                        required
                    />
                    <br />
                    <Select
                        name="size"
                        value={size}
                        onChange={handleValueChange}
                        margin="dense"
                        displayEmpty
                        required
                    >
                        <MenuItem value="">
                            <em>Select Size</em>
                        </MenuItem>
                        <MenuItem value="S">S</MenuItem>
                        <MenuItem value="M">M</MenuItem>
                        <MenuItem value="L">L</MenuItem>
                        <MenuItem value="XL">XL</MenuItem>
                        <MenuItem value="XXL">XXL</MenuItem>
                        <MenuItem value="28">28</MenuItem>
                        <MenuItem value="30">30</MenuItem>
                        <MenuItem value="32">32</MenuItem>
                        <MenuItem value="34">34</MenuItem>
                    </Select>
                    <br />
                    <TextField
                        label="구매가격/xxx엔(혹은 원)"
                        type="text"
                        name="purchasePrice"
                        value={purchasePrice}
                        onChange={handleValueChange}
                        required
                    />
                    <br />
                    <Select
                        label="재고 장소"
                        name="location"
                        value={location}
                        onChange={handleValueChange}
                        margin="dense"
                        displayEmpty
                        required
                        >
                        <MenuItem value="">
                            <em>재고 장소</em>
                        </MenuItem>
                        <MenuItem value="일본">일본</MenuItem>
                        <MenuItem value="한국">한국</MenuItem>
                    </Select>
                    <br />
                    <TextField
                        label="구매 날짜/YYYYMMDD"
                        type="text"
                        name="purchaseDate"
                        value={purchaseDate}
                        onChange={handleValueChange}
                        required
                    />
                    <br />
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleFormSubmit}
                    >
                        추가
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={handleClose}
                    >
                        닫기
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default withStyles(styles)(ItemAdd);
