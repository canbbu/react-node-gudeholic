import React, { useState } from 'react';
import axios from 'axios';
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

function ItemUpdate({
    classes,
    userName,
    stateRefresh,
    id,
    name, // Passed from parent
    size, // Passed from parent
    purchasePrice: initialPurchasePrice,
    soldPrice: initialSoldPrice,
    location: initialLocation,
    purchaseDate: initialPurchaseDate,
    open, // Passed from parent to control dialog open state
    onClose, // Callback to close the dialog
}) {
    const [file, setFile] = useState(null);
    const [purchasePrice, setPurchasePrice] = useState(initialPurchasePrice);
    const [location, setLocation] = useState(initialLocation);
    const [purchaseDate, setPurchaseDate] = useState(initialPurchaseDate);
    const [soldPrice, setSoldPrice] = useState(initialSoldPrice);
    const [fileName, setFileName] = useState('');

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setFileName(e.target.value.split('\\').pop());
    };

    const handleValueChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'purchasePrice':
                setPurchasePrice(value);
                break;
            case 'soldPrice':
                setSoldPrice(value);
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
        updateItem()
            .then((response) => {
                console.log(response.data);
                stateRefresh();
            })
            .catch((error) => {
                console.error("There was an error!", error);
            })
            .finally(() => {
                onClose(); // Close the dialog after submitting
                window.location.reload();
            });
    };

    const updateItem = () => {
        const url = '/api/items/update';
        const formData = new FormData();
        formData.append('id', id);
        formData.append('userName', userName);
        formData.append('image', file);
        formData.append('name', name);
        formData.append('size', size);
        formData.append('purchasePrice', purchasePrice);
        formData.append('soldPrice', soldPrice);
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
        <Dialog open={open} onClose={onClose}> {/* Control the dialog with open prop */}
            <DialogTitle>재고 수정</DialogTitle>
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
                    <Button variant="contained" color="primary" component="span">
                        {fileName === '' ? '프로필 이미지 삽입' : fileName}
                    </Button>
                </label>
                <br />
                <br />
                <br />
                {/* item and size not editable */}
                <TextField
                    label="아이템/브랜드.아이템.색"
                    type="text"
                    name="name"
                    value={name}
                    disabled 
                />
                <br />
                <TextField
                    label="사이즈/대문자입력"
                    type="text"
                    name="size"
                    value={size}
                    disabled 
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
                    label="판매가격/xxx엔(혹은 원)"
                    type="text"
                    name="soldPrice"
                    value={soldPrice}
                    onChange={handleValueChange}
                />
                <br />
                <Select
                    label="재고 장소"
                    name="location"
                    value={location}
                    onChange={handleValueChange}
                    displayEmpty
                    fullWidth
                >
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
                />
                <br />
            </DialogContent>
            <DialogActions>
                <Button variant="contained" color="primary" onClick={handleFormSubmit}>
                    저장
                </Button>
                <Button variant="outlined" color="secondary" onClick={onClose}>
                    취소
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default withStyles(styles)(ItemUpdate);
