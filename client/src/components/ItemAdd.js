import React, { useState } from 'react';
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
                    />
                    <br />
                    <TextField
                        label="사이즈/대문자입력"
                        type="text"
                        name="size"
                        value={size}
                        onChange={handleValueChange}
                    />
                    <br />
                    <TextField
                        label="구매가격/xxx엔(혹은 원)"
                        type="text"
                        name="purchasePrice"
                        value={purchasePrice}
                        onChange={handleValueChange}
                    />
                    <br />
                    <TextField
                        label="재고 장소/ 한국 혹은 일본"
                        type="text"
                        name="location"
                        value={location}
                        onChange={handleValueChange}
                    />
                    <br />
                    <TextField
                        label="구매 날짜/YYYYMMDD"
                        type="text"
                        name="purchaseDate"
                        value={purchaseDate}
                        onChange={handleValueChange}
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
