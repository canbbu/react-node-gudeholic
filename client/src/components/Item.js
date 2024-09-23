import React, { useState } from 'react';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import ItemDelete from './ItemDelete';
import ItemUpdate from './ItemUpdate';
import Button from '@mui/material/Button';

function Item({ id, userName, stateRefresh, ...props }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleEditOpen = () => setIsEditing(true);
    const handleEditClose = () => setIsEditing(false);

    return (
        <TableRow>
            <TableCell>
                <Button variant="contained" color="primary" onClick={handleEditOpen} >
                    Edit
                </Button>
                {/* Render ItemUpdate as a dialog and pass the necessary props */}
                {isEditing && (
                    <ItemUpdate
                        id={id}
                        userName={userName}
                        stateRefresh={stateRefresh}
                        name={props.name} // Assuming `name` is the item name
                        size={props.size}
                        purchasePrice={props.purchasePrice}
                        soldPrice={props.soldPrice}
                        location={props.location || '일본'}
                        purchaseDate={props.purchaseDate}
                        open={isEditing}
                        onClose={handleEditClose} // Close dialog when done
                    />
                )}
            </TableCell>
            <TableCell>
                <img src={props.image} alt={props.name} style={{ width: '50px' }} />
            </TableCell>
            <TableCell>{props.name}</TableCell>
            <TableCell>{props.size}</TableCell>
            <TableCell>{props.purchasePrice}</TableCell>
            <TableCell>{props.soldPrice}</TableCell>
            <TableCell>{props.location || '일본'}</TableCell>
            <TableCell>{props.isSold ? 'Sold' : 'Not Sold'}</TableCell>
            <TableCell>{props.purchaseDate}</TableCell>
            <TableCell>
                <ItemDelete id={id} stateRefresh={stateRefresh} />
            </TableCell>
        </TableRow>
    );
}

export default Item;
